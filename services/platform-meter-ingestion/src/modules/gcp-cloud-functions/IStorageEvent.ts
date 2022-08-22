export interface IStorageEvent {
  bucket: string;
  contentType: string;
  crc32c: string;
  etag: string;
  eventBasedHold: boolean;
  generation: string;
  id: string;
  kind: string;
  md5Hash: string;
  mediaLink: string;
  metageneration: string;
  name: string;
  selfLink: string;
  size: string;
  storageClass: string;
  temporaryHold: boolean;
  timeCreated: string;
  timeStorageClassUpdated: string;
  updated: string;
}
