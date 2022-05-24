import http from "@/api/http";

export const pullFile = (uuid: string, directory: string, url: string, file_name : string | undefined, foreground:boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/servers/${uuid}/files/pull`, { directory, url, file_name, foreground })
            .then(() => resolve())
            .catch(reject);
    });
};