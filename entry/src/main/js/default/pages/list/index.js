import app from '@system.app';
import router from '@system.router';
import network from '@system.network';
import fetch from '@system.fetch';
import file from '@system.file';

const URI_DIRLIST = "internal://app/albumList.txt";

export default {
    data: {
        title: 'Music',
        columns: 2,
        dataList: [],
        tempList: [],
        beginIndex: 0,
        endIndex: 0,
        isWifiAvailable: false,
        titleBgColor: "#000000",
        baseUrl: "https://cmod.h1n.ru",
    },

    onInit() {

        this.dataList.push({
            src: 'file',
            id: 'file'
        });

        this.dataList.push({
            src: 'lst: music',
            id: 'music'
        });

        network.subscribe({
            type: "WIFI",
            callback: (e) => {
                this.isWifiAvailable = e;
                if (this.isWifiAvailable) {
                    this.titleBgColor = "#003300";
                }

                this.loadRemoteList();
            },
        });
    },

    onHide() {
        network.unsubscribe({type: "WIFI"});
    },

    loadRemoteList() {

        if (this.isWifiAvailable) {

            fetch.fetch({
                url: this.baseUrl + "/app/dir",
                method: "GET",
                success: (e) => {

                    let jsonText = JSON.stringify(e.data);

                    file.writeText({
                        uri: URI_DIRLIST,
                        text: jsonText
                    });

                    this.updateDirList(e.data);
                }
            });
        }
        else {
            file.readText({
                uri: URI_DIRLIST,
                success: (e) => {

                    let data = JSON.parse(e.text);
                    this.updateDirList(data);
                }
            });
        }
    },

    updateDirList(data) {

        //if (this.dataList.length > 2) return;

        data.forEach((song) => {
            this.dataList.push({
                src: "lst: "+ song.msg,
                id: song.msg
            });
        });
    },

    onTitleClick(e) {
        router.replace({uri: "pages/index/index" });
    },

    onItemClick(e) {
        if (e == "file")
            router.replace({uri: "pages/file/index", params: { src: e } });
        if (e != "file")
            router.replace({uri: "pages/network/index", params: { src: e } });
    },

    touchMove(e) {
        if (e.direction == "right") {

            app.terminate();

            //router.replace({
            //    uri: "pages/index/index"
            //});
        }
    },

    buildItem(param) {
        if (this.dataList.length == 0) {
            return;
        }
        this.beginIndex = param.begin;
        this.endIndex = param.end;
        let tempArray = [];
        for (let index = this.beginIndex;index < this.endIndex; ++index) {
            let tempIndex = index % this.imgsrc.length;
            let tempValue = JSON.parse(JSON.stringify(this.dataList[tempIndex]));
            tempArray.push(tempValue);
        }
        this.tempList = tempArray;
    }
}
