class VNode {
    constructor(tag, data, value, type) {
        this.tag = tag && tag.toLowerCase()
        this.data = data
        this.value = value
        this.type = type
        this.childens = []
    }
    appendChild (vnode) {
        if (vnode) {
            this.childens.push(vnode)
        }
    }
}
/**
 * 将dom元素转换成虚拟dom（vnode）
 * @param {*} node 原始dom元素
 */
function DomChangeVNode (node) {
    let _vnode;
    let nodeType = node.nodeType
    if (nodeType === 1) {
        // 如果是DOM标签
        let nodeName = node.nodeName
        // 取元素的所有属性，属性取出来是个伪数组需要转换成对象
        let nodeAttributes = node.attributes
        let _attrObj = {}
        if (nodeAttributes) {
            for (let index = 0; index < nodeAttributes.length; index++) {
                const _attributes = nodeAttributes[index];
                _attrObj[_attributes.nodeName] = _attributes.nodeValue;
            }
        }
        // 创建虚拟dom
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType)
        // 如果当前元素有子元素 使用递归方式 将子元素插入到当前元素中
        let childNodes = node.childNodes
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            // 使用递归将返回的vnode元素append到当前元素中
            _vnode.appendChild(DomChangeVNode(childNode))
        }
    }
    else if (nodeType === 3) {
        // 如果是DOM文本
        let nodeValue = node.nodeValue.trim()

        if (nodeValue) { _vnode = new VNode('Text', undefined, nodeValue, nodeType) }

    }
    return _vnode;
}

function VNodeChangeDom (vnode) {
    let type = vnode.type
    let _vnode = null
    if (type === 3) {
        // DOM文本类
        return document.createTextNode(vnode.value)
    }
    else if (type === 1) {
        // DOM 标签类
        let childNodes = vnode.childens
        let attributes = vnode.data
        let nodeName = vnode.tag
        _vnode = document.createElement(nodeName)
        // 循环设置attributes
        for (const key in attributes) {
            let _value = attributes[key]
            _vnode.setAttribute(key, _value)
        }
        // 遍历子元素使用递归处理
        if (childNodes.length > 0) {
            for (let index = 0; index < childNodes.length; index++) {
                const childNode = childNodes[index];
                _vnode.appendChild(VNodeChangeDom(childNode))
            }
        }
        return _vnode
    }
}


