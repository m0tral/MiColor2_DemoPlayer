import router from '@system.router';
import network from '@system.network';
import fetch from '@system.fetch';
import request from '@system.request';
import file from '@system.file';
import brightness from '@system.brightness';
import audio from '@system.audio';

const ICON_DOWNLOAD = "download";
const ICON_DOWNLOAD_ACTIVE = "download_a";
const ICON_PLAY = "play";
const ICON_PAUSE = "pause";
const URI_PLAYLIST = "internal://app/playlist.txt";

export default {

    data: {
        title: 'Player',
        fileList: [],
        dataList: [],
        isWifiAvailable: false,
        baseUrl: "https://www.conversmod.ru:3443",
        titleBgColor: "#000000",
        activeItemId: -1,
        activeItemSrc: "",
        activeItemPos: 0,
        playerStatus: "ready",
        scrollTimer: -1,
        downloading: false,
        progress: 0,
        token: "",
    },

    onInit() {

        var caller = this.src;

        network.subscribe({
            type: "WIFI",
            callback: (e) => {
                this.isWifiAvailable = e;
                if (this.isWifiAvailable) {
                    this.titleBgColor = "#003300";
                }

                this.loadLocalList();
                this.loadRemoteList();
            },
        });

        //let loadFiles = new Promise(() => {
        //});
        //loadFiles.then(() => {
        //});
    },

    loadRemoteList() {

        if (this.isWifiAvailable) {

            fetch.fetch({
                url: this.baseUrl + "/micolor/list",
                method: "GET",
                success: (e) => {

                    let jsonText = JSON.stringify(e.data);

                    file.writeText({
                        uri: URI_PLAYLIST,
                        text: jsonText
                    });

                    this.updateSongList(e.data);
                },
                fail: (e) => {
                    this.dataList.push({
                        src: 'net: ' + e,
                        id: 0
                    });
                }
            });
        }
        else {
            file.readText({
                uri: URI_PLAYLIST,
                success: (e) => {

                    let data = JSON.parse(e.text);
                    this.updateSongList(data);
                },
                fail: (e) => {
                    this.dataList.push({
                        src: 'fs: ' + e,
                        id: 0
                    });
                }
            });
        }
    },

    updateSongList(data) {

        data.forEach((song) => {

            let index = -1;
            if (this.fileList.length > 0) {
                //index = this.fileList.findIndex(s => s.id == song.id);
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].id == song.id) {
                        index = i;
                        break;
                    }
                }
            }

            this.dataList.push({
                src: song.msg,
                id: song.id,
                icon: (index == -1) ? ICON_DOWNLOAD : ICON_PLAY,
                status: (index == -1) ? "down" : "ready",
                progress: 0,
                class: "itemName",
            });
        });
    },

    loadLocalList() {

        file.list({
            uri: "internal://app",
            success: (e) => {
                var lst = e.fileList;

                try
                {
                    lst.forEach((item) => {
                        let name = item.uri.slice(15);
                        this.fileList.push({
                            src: name,
                            id: name.slice(0, name.lastIndexOf('.')),
                        });
                    });
                }
                catch(e) {
                }
            },
            fail: (e) => {
            }
        });
    },

    downloadFile(eid) {
        let itemId = Number(eid)-1;

        if (!this.isWifiAvailable) return;

        if (this.downloading) return;
        this.downloading = true;

        request.download({
            url: this.baseUrl + "/micolor/get/"+ eid,
            filename: "internal://app/"+ eid + ".mp3",
            success: (e) => {
                this.titleBgColor = "#000033";
                this.dataList[itemId].icon = ICON_DOWNLOAD_ACTIVE;
                this.token = e.token;
            },
            fail: (e) => {
                this.title = "Player";
                this.titleBgColor = "#003300";
                this.dataList[itemId].icon = ICON_DOWNLOAD;
                this.dataList[itemId].status = "down";
                this.downloading = false;

                file.delete({
                    uri: "internal://app/"+ eid + ".mp3"
                });
            },
            onDownLoadNotify: (e) => {
                let color = e.percent < 10 ? "0"+e.percent : e.percent;
                if (e.percent == 100) {
                    this.title = "Player";
                    this.titleBgColor = "#003300";
                    this.dataList[itemId].icon = ICON_PLAY;
                    this.dataList[itemId].status = "ready";
                    this.downloading = false;
                }
                else {
                    this.title = e.percent + "%";
                    this.titleBgColor = "#0000" + color;
                }
            },
        });
    },

    playFile(eid) {
        let itemId = Number(eid)-1;
        let audioName = "internal://app/"+ eid +".mp3";
        audio.stop();
        audio.src = audioName;
        audio.play();

        this.playerStatus = "play";

        this.clearScrollTimer();

        if (this.activeItemId >= 0 && this.activeItemId != itemId) {
            this.dataList[this.activeItemId].icon = ICON_PLAY;
            this.dataList[this.activeItemId].status = "ready";
            this.dataList[this.activeItemId].progress = 0;
        }

        this.activeItemId = itemId;
        this.dataList[itemId].icon = ICON_PAUSE;
        this.dataList[itemId].status = "play";

        audio.ontimeupdate = () => {

            if (this.playerStatus != "play") return;

            //this.title = "playing: "+ audio.currentTime +"%";
            this.dataList[this.activeItemId].progress = (audio.currentTime * 466)/100;

            if (audio.currentTime == 100) {
                this.dataList[this.activeItemId].icon = ICON_PLAY;
                this.dataList[this.activeItemId].status = "ready";
                this.dataList[this.activeItemId].progress = 0;
                this.title = "Player";

                this.playerStatus = "ready";
                this.clearScrollTimer();
            }
        };

        this.startScrollTimer();
    },

    startScrollTimer() {

        this.dataList[this.activeItemId].class = "itemNameScroll";
        this.activeItemSrc = this.dataList[this.activeItemId].src;
        this.activeItemPos = 0;

        this.scrollTimer = setInterval(() => {
            let len = this.activeItemSrc.length;
            let lenScroll = 14;

            if (this.playerStatus != "play") return;
            if (len == 0) return;

            if (this.activeItemPos > (len - lenScroll))
                this.activeItemPos = 0;

            this.dataList[this.activeItemId].src =
                this.activeItemSrc.slice(this.activeItemPos, this.activeItemPos + lenScroll);

            this.activeItemPos++;
        },1000);
    },

    clearScrollTimer() {
        if (this.scrollTimer != -1) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = -1;

            this.dataList[this.activeItemId].src = this.activeItemSrc;
            this.dataList[this.activeItemId].class = "itemName";
            this.activeItemSrc = "";
            this.activeItemPos = 0;
        }
    },

    stopFile(eid) {
        let itemId = Number(eid)-1;

        this.playerStatus = "stop";
        audio.ontimeupdate = null;
        audio.stop();

        this.title = "Player";

        this.dataList[itemId].progress = 0;
        this.dataList[itemId].icon = ICON_PLAY;
        this.dataList[itemId].status = "ready";

        this.clearScrollTimer();
    },

    onShow() {
        brightness.setKeepScreenOn({ keepScreenOn: false });
    },

    onHide() {
        network.unsubscribe({type: "WIFI"});
    },

    onItemClick(e, status) {

        if (e !== "0") {
             if (status == "ready")
                this.playFile(e);
             else if (status == "play")
                this.stopFile(e);
             else
                this.downloadFile(e);
        }
    },

    onTitleClick(e) {
        router.replace({uri: "pages/list/index" });
    },

    touchMove(e) {
        if (e.direction == "right") {
            router.replace({
                uri: "pages/list/index"
            });
        }
    },
}
