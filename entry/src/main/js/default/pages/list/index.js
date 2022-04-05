import router from '@system.router';

export default {
    data: {
        title: 'test',
        columns: 2,
        dataList: [],
        tempList: [],
        beginIndex: 0,
        endIndex: 0,
    },

    onInit() {
        this.dataList.push({
                src: 'file',
                id: 'file'
            });
        this.dataList.push({
            src: 'network',
            id: 'network'
        });
    },

    onTitleClick(e) {
        router.replace({uri: "pages/index/index" });
    },

    onItemClick(e) {
        if (e == "file")
            router.replace({uri: "pages/file/index", params: { src: e } });
        if (e == "network")
            router.replace({uri: "pages/network/index", params: { src: e } });
    },

    touchMove(e) {
        if (e.direction == "right") {

            router.replace({
                uri: "pages/index/index"
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
