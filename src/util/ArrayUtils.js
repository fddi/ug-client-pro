import StringUtils from './StringUtils';

const generateList = (tree, dataList) => {
    if (StringUtils.isEmpty(tree)) {
        return;
    }
    if (tree.key && tree.key > 0) {
        const item = {
            key: tree.key,
            title: tree.title,
            value: tree.value,
            checked: tree.checked || false,
        };
        dataList.push(item);
    }
    const data = tree.children;
    if (StringUtils.isEmpty(data)) {
        return;
    }
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        generateList(node, dataList);
    }
};

export default {
    objToArray: function (obj) {
        let array = [];
        Object.keys(obj).forEach(key => {
            array.push(obj[key]);
        })
        return array;
    },
    treeToArray: generateList,
}
