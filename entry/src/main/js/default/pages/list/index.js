import app from '@system.app';
import router from '@system.router';
import device from '@system.device';
import storage from '@system.storage';
import file from '@system.file';

const BindKey = "bindkey";
const APP_DIR = "app.player";

export default {
    data: {
        title: 'Settings',
        columns: 2,
        dataList: [],
        tempList: [],
        beginIndex: 0,
        endIndex: 0,
        titleBgColor: "#000000",
        sn: "",
    },

    onInit() {

        device.getInfo({
            success: (options) => {
                this.sn = options.IMEI;
            }
        });

        this.dataList.push({
            src: 'file manager',
            id: 'file'
        });

        this.dataList.push({
            src: 'playlist',
            id: 'music'
        });

        this.dataList.push({
            src: 'reload',
            id: 'reload'
        });

        this.dataList.push({
            src: 'exit',
            id: 'exit'
        });
    },

    onHide() {
    },

    updateDirList(data) {

        //if (this.dataList.length > 2) return;

        data.forEach((song) => {
            this.dataList.push({
                src: ""+ song.msg,
                id: song.msg
            });
        });
    },

    onTitleClick(e) {
    },

    onItemClick(e) {
        if (e == "file")
            router.replace({uri: "pages/file/index", params: { src: e } });
        if (e == "music")
            router.replace({uri: "pages/network/index", params: { src: this.sn } });
        if (e == "reload") {

            storage.delete({ key: BindKey });
            this.deleteExistFiles();

            router.replace({
                uri: "pages/login/index",
                params: { src: this.sn }
            });
        }
        if (e == "exit")
            app.terminate();
    },

    deleteExistFiles() {
        file.list({
            uri: "internal://app",
            success: (e) => {
                e.fileList.forEach((item) => {
                    file.delete({ uri: item.uri });
                });
            },
        });
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
        if (e.direction == "left") {
            router.replace({
                uri: "pages/network/index",
                params: { src: this.sn }
            });
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
