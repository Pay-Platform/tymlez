import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';
import { ld as vcjs } from '@transmute/vc.js';
import { v4 } from 'uuid';
import type { DocumentLoaderFunction } from './document-loader-function';
import { DocumentLoader } from './document-loader';

export class VCHelper {
  private documentLoaders: DocumentLoader[];
  private loader: DocumentLoaderFunction;

  constructor() {
    this.documentLoaders = [];
  }

  public addDocumentLoader(documentLoader: DocumentLoader): void {
    this.documentLoaders.push(documentLoader);
  }

  public buildDocumentLoader(): void {
    this.loader = DocumentLoader.build(this.documentLoaders);
  }

  public async createSuite(didDocument: any): Promise<Ed25519Signature2018> {
    const [verificationMethod] = didDocument.verificationMethod;
    const key = await Ed25519VerificationKey2018.from(verificationMethod);
    return new Ed25519Signature2018({ key });
  }

  public async issue(
    vc: any,
    suite: Ed25519Signature2018,
    documentLoader: DocumentLoaderFunction,
  ): Promise<any> {
    return await vcjs.createVerifiableCredential({
      credential: vc,
      suite,
      documentLoader,
    });
  }

  public async createVC(
    subject: any,
    didDocument: any,
    did: string,
  ): Promise<any> {
    const id = v4();
    const suite = await this.createSuite(didDocument);
    const vc = {
      id,
      type: ['VerifiableCredential'],
      issuer: did,
      issuanceDate: new Date().toISOString(),
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      credentialSubject: [subject],
    };
    return await this.issue(vc, suite, this.loader);
  }
}
