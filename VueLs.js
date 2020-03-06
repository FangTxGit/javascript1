class VueLs {
    constructor(options) {
        this._el = options.el
        this._data = options.data
        this.render()
    }
    /**
     * 模板渲染
     */
    render () {
        const temlpateHtml = document.querySelector(this._el)
        this.compiler(temlpateHtml, this._data)
    }
    compiler (template, data) {
        const childNodes = template.childNodes;
        const regular = /\{\{(.+?)\}\}/g
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            const nodeType = childNode.nodeType;
            if (nodeType === 1) {
                // 1为元素标签
                // 使用递归继续查找子元素中的文本标签
                this.compiler(childNode, data)
            }
            else if (nodeType === 3) {
                // 3为文本标签
                const nodeValue = childNode.nodeValue
                // 使用正则表达式 将花括号内的元素替换成data[key]的值
                // 每匹配一次回调函数就会进一次 因为正则只有一个分组 所以参数中的第0个参数为匹配的{{name}} 那么第1个参数就为name
                const templateValue = nodeValue.replace(regular, (_, g) => {
                    const _g = g.trim()
                    // const _value = this._data[_g]
                    const _value = this.getObjTemplateValue(this._data, _g)
                    return _value
                })
                // 将替换完正则的数据在回填到childNode元素中去
                childNode.nodeValue = templateValue
            }
        }
    }
    // 解析对象的值 比如sub.first在data中要返回sub[first]
    getObjTemplateValue (data, paths) {
        const pathArray = paths.split('.')
        // ['xxx','yyy','zzz']
        let res = data;
        let prop;
        while (prop = pathArray.shift()) {
            res = res[prop]
        }
        return res
        // const obj = data[pathArray[0]]
        // obj = obj[pathArray[1]]
        // obj = obj[pathArray[2]]

    }
}