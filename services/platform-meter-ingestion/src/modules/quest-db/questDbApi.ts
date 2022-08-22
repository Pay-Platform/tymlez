import axios from 'axios';

export class QuestDBApi {
  constructor(private host: string) {}

  async exec(query: string) {
    const { data } = await axios.get(`http://${this.host}:9000/exec`, {
      params: {
        query,
      },
    });
    return data;
  }
}
