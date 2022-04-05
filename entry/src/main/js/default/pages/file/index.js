import router from '@system.router';
import file from '@system.file';

export default {
    data: {
        title: 'File',
        dataList: [],
        fileCreated: false,
        progress: 0,
    },

    onInit() {

        var caller = this.src;

        /*
        file.writeText({
            uri: "internal://app/sample.txt",
            text: "hello world",
            success: (e) => {
                this.fileCreated = true;
                this.dataList.push({
                    src: 'file created',
                    id: 1
                });
            },
            fail: (e) => {
                this.dataList.push({
                    src: 'file failed',
                    id: 1
                });
            }
        });

        file.writeText({
            uri: "internal://app/settings.txt",
            text: "hello world",
            success: (e) => {
                this.fileCreated = true;
                this.dataList.push({
                    src: 'file created',
                    id: 1
                });
            },
            fail: (e) => {
                this.dataList.push({
                    src: 'file failed',
                    id: 1
                });
            }
        });

        file.readText({
            uri: "internal://app/settings.txt",
            success: (e) => {
                this.fileCreated = true;
                this.dataList.push({
                    src: 'read success',
                    id: 2
                });
            },
            fail: (e) => {
                this.dataList.push({
                    src: 'read failed',
                    id: 2
                });
            }
        });
        */

        this.bindFileList();
    },

    bindFileList() {

        this.dataList = [];

        file.list({
            uri: "internal://app",
            success: (e) => {
                var lst = e.fileList;

                try
                {
                    lst.forEach((item) => {
                        this.dataList.push({
                            uri: item.uri,
                            src: item.uri.slice(15),
                            id: 3
                        });
                    });
                }
                catch(e) {
                    this.dataList.push({
                        src: 'list empty',
                        id: 3
                    });
                }
            },
            fail: (e) => {
                this.dataList.push({
                    src: 'list fail',
                    id: 3
                });
            }
        });
    },

    onTitleClick(e) {
        router.replace({uri: "pages/list/index" });
    },

    onItemClick(e) {
        file.delete({uri: e});
        this.bindFileList();
    },

    touchMove(e) {
        if (e.direction == "right") {

            router.replace({
                uri: "pages/list/index"
            });
        }
    },
}
