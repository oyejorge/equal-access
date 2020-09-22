/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  *****************************************************************************/
 
import CommonMessaging from "./commonMessaging";

export default class TabMessaging {

    public static addListener(type: string, listener: (message: any) => Promise<any>) {
        CommonMessaging.addListener(type, listener);
    }

    public static sendToBackground(type: string, message: any): Promise<any> {
        let myMessage = JSON.parse(JSON.stringify(message));
        myMessage.type = type;

        //chrome.tabs.get(myMessage.tabId, function( tab) { })

        if(type == "DAP_SCAN_TAB_COMPLETE" && myMessage.report){
            
            var json_string = JSON.stringify(myMessage);
            var blob = new Blob([json_string], {type: "application/json"});

            var url  = URL.createObjectURL(blob);
            delete myMessage.report;
            myMessage.blob_url = url;
        }

        return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(myMessage, async function (res) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else {
                    if (res) {
                        if (typeof res === "string") {
                            try {
                                res = JSON.parse(res);
                            } catch (e) {}
                        }
                        resolve(res);
                    } else {
                        resolve();
                    }
                }
			});
        })
    }

}
