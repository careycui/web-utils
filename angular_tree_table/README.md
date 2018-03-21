### angular tree table 组件  
结合bootstrap与jquery编写的树形表格组件，支持同级排序，不支持跨级排序与子节点的lazy load。  
可自定义表头，自定义操作链接。 
### 配置与数据源
```javascript
//数据源配置
var model = {
    //自定义表头项，表头固定带有首列'名称' 列，固数据源中'name'字段必备；
    thead:[{
            title: '子分类(个)'
        },{
            title: '状态',
        }],
    //对应自定义表头的数据字段，通过该字段获取数据展示
    props:['sub_num', 'status'],
    //对应操作列，如果配置则展示操作列，不配置则不展示
    btns:[{
            name: '新增子类', //操作按钮名称
            fn_type: 'new_sub',//操作type
            expression: 'node.count < 2'//操作是否展示表达式
        },{
            name: '编辑',
            fn_type: 'edit',
            expression: true
        },{
            name: '查看题目',
            fn_type: 'check',
            expression: 'node.data.publish == 1'
        },{
            name: '删除',
            fn_type: 'del',
            expression: true
    }],
    //数据源，id name children必备字段
    data:[{
        id: '1',
        name: 'test1',
        sub_num: 4,
        status: '启用',
        children:[{
            id: '11',
            name: 'test11',
            sub_num: 1,
            status: '启用',
            children:[{
                id: '111',
                name: 'test111',
                sub_num: 0,
                status: '禁用',
            }]
        },{
            id: '12',
            name: 'test12',
            sub_num: 1,
            status: '启用',
            children:[{
                id: '121',
                name: 'test121',
                sub_num: 0,
                status: '禁用',
            }]
        },{
            id: '13',
            name: 'test13',
            sub_num: 1,
            status: '启用',
            children:[{
                id: '131',
                name: 'test131',
                sub_num: 0,
                status: '禁用',
            }]
        },{
            id: '14',
            name: 'test14',
            sub_num: 1,
            status: '启用',
            children:[{
                id: '141',
                name: 'test141',
                sub_num: 0,
                status: '禁用',
            }]
        }]
    }]
}
```  
### 使用
前提： 页面引入angular、bootstrap、jquery  
1.  页面引入组件js与css:  
```html
<link rel="stylesheet" type="text/css" href="[libpath]/angular_tree.css">
<script type="text/javascript" src="[libpath]/angular_tree.js"></script>
```
2.  module注入*aui.angular-tree*
```javascript
angular.module('app', ['aui.angular-tree'])
```  

3.  页面使用
```html
<tree-table
    sortable // 可拖拽排序
    btn-handler="nodeClick(node, type)" //操作方法回调
    tree="tree">
</tree-table>
```
