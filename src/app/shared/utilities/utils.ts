//import { Logger } from '@alfresco/adf-testing';

export class Utils {

  static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1500): Promise<any> {
    const pause = (duration: number) => new Promise((res) => setTimeout(res, duration));

    const run = (retries: number): Promise<any> => {
      return fn().catch((err) => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));
    };

    return run(retry);
  }

  async waitForSitesToBeCreated(sitesIds: string[]) {
    try {
      const site = async () => {
        const sitesList: any[] =[];
        const foundItems = sitesIds.every((id) => sitesList.includes(id));
        if (foundItems) {
          return Promise.resolve(foundItems);
        } else {
          return Promise.reject(foundItems);
        }
      };

      return await Utils.retryCall(site);
    } catch (error) {
        console.log(error);
    }
  }

}
