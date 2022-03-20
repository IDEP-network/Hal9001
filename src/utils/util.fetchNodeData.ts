import fetch from 'node-fetch';

export class UtilFetchNodeData {

    public static apiUrl;

    public static async getNodeStatus(nodeAddress): Promise<any> {
        UtilFetchNodeData.apiUrl = `http://${nodeAddress}`;
        return await fetch(`${UtilFetchNodeData.apiUrl}/status`).then(res => res.json()).catch(e => (null));
    }

    public static async getNetInfo (): Promise<any> {
         return await fetch(`${UtilFetchNodeData.apiUrl}/net_info`).then(res => res.json());
    }
}