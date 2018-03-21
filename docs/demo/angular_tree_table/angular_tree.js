/**
 * angular tree table 组件
 * @param  {object} root    window对象
 * @param  {object} angular 
 * @return 
 *
 * @author careycui
 *
 * @date 2018/3/21
 */
(function(root, angular){
	'use strict';

	/**
	 * sort 排序时，移动相关数据存储对象
	 * 	target sort排序→排序对象bounding rect数据
	 * 	start 鼠标开始位置
	 * 	offset 鼠标移动距离
	 *
	 * 	placeholder 拖拽排序到达位置占位DOM元素
	 *
	 * 	moveDom 拖拽排序随鼠标移动指示元素
	 *
	 */
	function Move(ops){
		this.target = {
			top: 0,
			left: 0,
			height: 0,
			width: 0
		};
		this.start = {
			x: 0,
			y: 0
		};
		this.offset = {
			x: 0,
			y: 0
		}
		this.colspan = ops.colspan;
		this.m_dwidth = 300;
		this.move_enabled = false;
		this.initMoveDom();
		this.initPlaceholder();
	}
	Move.prototype.initPlaceholder = function(){
		var $place = document.createElement('tr');
		$place.id = 'placeholder';
		var $td = document.createElement('td');
		$td.colSpan = this.colspan;
		$td.style="height:2px;background-color:rgba(0,0,0,.4);padding:0;"
		$place.appendChild($td);
		this.$place = $place;
	}
	Move.prototype.initMoveDom = function(){
		var $move = document.getElementById('sort-move__div');
		if(!$move){
			$move = document.createElement('div');
			$move.id = 'sort-move__div';
			$move.style = 'position:fixed;width:'+ this.m_dwidth +'px;height:50px;background-color:rgba(0, 0, 0, .2);display:none;';
			document.body.appendChild($move);
		}
		this.$move = $move;
	}
	Move.prototype.activeMoveDom = function(){
		this.$move.style.display = 'block';
	}
	Move.prototype.disableMoveDom = function(){
		this.$move.style.display = 'none';
	}
	Move.prototype.setMoveDomStyle = function(){
		var start = this.start;

		this.$move.style.height = this.target.height + 'px';
		this.$move.style.left = (start.x - this.m_dwidth*2/3) + 'px';
		this.$move.style.top = (start.y - this.target.height/2) + 'px';
	}
	Move.prototype.startMove = function(mx, my){
		this.setOffset(mx, my);
		var pos = this.getCursorPos();
		this.$move.style.top = (pos.top) + 'px';
	}

	Move.prototype.setTarget = function(tmp){
		this.target.top = tmp.top + window.pageYOffset;
		this.target.left = tmp.left + window.pageXOffset;
		this.target.height = tmp.height;
		this.target.width = tmp.width;
	}
	Move.prototype.setStart = function(x, y){
		this.start.x = x;
		this.start.y = y;

		this.setMoveDomStyle();
		this.activeMoveDom();
	}
	Move.prototype.setOffset = function(mx, my){
		this.offset.x = mx - this.start.x;
		this.offset.y = my - this.start.y;
	}
	Move.prototype.getCursorPos = function(){
		var start = this.start;
		var offset = this.offset;
		var target = this.target;
		return {
			top: start.y - target.height/2 + offset.y  - window.pageYOffset,
			left: start.x - this.m_dwidth/2 + offset.x
		}
	}
	Move.prototype.compare = function(brother_nodes){
		var pos = this.getCursorPos();
		var tmp;
		var before = false;
		var py = window.pageYOffset;
		for(var i=0;i<brother_nodes.length;i++){
			if(pos.top >= brother_nodes[i].top - py && pos.top <= brother_nodes[i].bottom - py){
				tmp = brother_nodes[i];
				break;
			}
		}
		if(!tmp){
			if(pos.top < brother_nodes[0].top - py){
				tmp = brother_nodes[0];
				before = true;
			}
			if(pos.top > brother_nodes[brother_nodes.length-1].bottom - py){
				tmp = brother_nodes[brother_nodes.length-1];
			}
		}
		return {
				tmp: tmp,
				before: before
			};
	}
	Move.prototype.getSortData = function(){
		var from = this.from;
		var to = this.to;

		return {
			from: from,
			to: to.tmp.node,
			before: to.before
		}
	}
	Move.prototype.reset = function(){
		this.target = {
			top: 0,
			left: 0,
			height: 0,
			width: 0
		};
		this.start = {
			x: 0,
			y: 0
		};
		this.offset = {
			x: 0,
			y: 0
		}
		this.$place.remove();
		this.disableMoveDom();
		this.move_enabled = false;
		this.from = void 0;
		this.to = void 0;
	}

	//data 转换方法，转换为组件适用数据
	function _convertModel(data, parentNode, callback){
		var parent = parentNode;
		for(var i=0;i<data.length;i++){
			var tmp = data[i];
			var n = new Node({
				id: parentNode.id + '-' + (tmp.id || i),
				parent: parent,
				data: tmp,
				sort: tmp.sort || i + 1
			});
			if(parentNode){
				parentNode.addChild(n);
			}
			callback(n);
			var children = data[i].children;
			if(children && children.length > 0){
				_convertModel(children, n, callback);
			}
		}

	}
	function _getNodes(data){
		var result =[];
		var tmp; 
		for(var i=0;i < data.length;i++){
			var t = data[i];
			tmp = new Node({
				id: t.id ||(i + ''),
				data: t,
				sort: t.sort || i + 1,
				index: result.length
			});
			result.push(tmp);
			var children = data[i].children;
			if(children && children.length > 0){
				_convertModel(children, tmp, function(node){
					node.index = result.length;
					result.push(node);
				});
			}
		}
		return result;
	}

	/**
	 * table node 存储
	 */
	function NodeSet(){
		this.nodes = [];
	}
	NodeSet.prototype.setDatas = function(origin){
		this.nodes = _getNodes(origin);
		return this.nodes;
	}
	NodeSet.prototype.getNodeById = function(nodeId){
		var tmpArr = this.nodes;
		var tmp;
		for(var i=0;i<tmpArr.length;i++){
			tmp = tmpArr[i];
			if(tmp.id == nodeId){
				break;
			}else{
				tmp = void 0;
			}
		}
		return tmp;
	}
	NodeSet.prototype._resetNodeIndex = function(){
		for(var i=0;i<this.nodes.length;i++){
			this.nodes[i].index = i;
		}
	}
	var _getSubNodes = function(nodes){
		var tmp = [];
		var arr = [];
		for(var i=0;i<nodes.length;i++){
			tmp.push(nodes[i]);
		}
		var node;
		while(tmp.length){
			node = tmp.shift();
			arr.push(node);
			if(node.sub_nodes && node.sub_nodes.length > 0){
				tmp = node.sub_nodes.concat(tmp);
			}
		}
		return arr;
	}
	NodeSet.prototype.resetSort = function(sortData){
		var from = sortData.from;
		var to = sortData.to;
		
		var tmpArr = [from].concat(_getSubNodes(from.sub_nodes));
		var toCount = 1 + _getSubNodes(to.sub_nodes).length;

		var toIndex;
		var fromCount = tmpArr.length;
		this.nodes.splice(from.index, fromCount);

		if(to.index > from.index){
			toIndex = to.index - fromCount + toCount;
		}else{
			toIndex = to.index + toCount;
		}

		if(sortData.before){
			toIndex = to.index;
		}

		for(var i=0;i<tmpArr.length;i++){
			this.nodes.splice(toIndex + i, 0, tmpArr[i]);
		}

		this._resetNodeIndex();
	}
	NodeSet.prototype.resetRect = function(nodes){
		var tmp;
		var tmpId;
		var tmpRect;
		for(var i=0;i<nodes.length;i++){
			tmp = nodes[i];
			tmpId = tmp.id;

			tmpRect = $('#' + tmpId)[0].getBoundingClientRect();
			tmp.top = tmpRect.top;
			tmp.bottom = tmpRect.bottom;
		}
	}
	NodeSet.prototype.getEqLevel = function($container, nodeId){
		var origins = nodeId.split('-');
		var level = origins.length;
		var parentId = (level>2)?origins[level-2]:void 0;
		var tmp = this.nodes;
		var result = [];
		var tmpId;
		var tmpArr;
		var tmpRect;
		var tmpNode;
		for(var i=0;i<tmp.length;i++){
			tmpId = 'node-'+tmp[i].id;
			tmpArr = tmpId.split('-');
			tmpRect = $container.find('#'+tmpId)[0].getBoundingClientRect();
			if( tmpArr.length == level && tmpId != nodeId){
				if(level > 2 && parentId === tmpArr[tmpArr.length - 2]){
					tmpNode = {
						id: tmpId,
						node: tmp[i],
						top: tmpRect.top + window.pageYOffset,
						bottom: tmpRect.bottom + window.pageYOffset
					};
					result.push(tmpNode);
				}
				if(level <= 2){
					tmpNode = {
						id: tmpId,
						node: tmp[i],
						top: tmpRect.top + window.pageYOffset,
						bottom: tmpRect.bottom + window.pageYOffset
					};
					result.push(tmpNode);
				}
			}
		}
		return result;
	}

	/**
	 * node 节点对象
	 * @param {object} ops
	 */
	function Node(ops){
		this.id = ops.id;
		this.sort = ops.sort;
		this.index = ops.index;
		this.parent = ops.parent;
		this.data = ops.data;
		this.isLeaf = ops.data.children?(ops.data.children.length>0?false:true):true;

		this.setIndent();
		this.sub_nodes = [];
		this.isExpand = false;
		this.isShow = this.parent===undefined?true:false;
	}
	Node.prototype.show = function(){
		this.isShow = true;
	}
	Node.prototype.hide = function(){
		this.isShow = false;
	}
	Node.prototype.expand = function(flag){
		if(this.isLeaf || this.sub_nodes.length < 1){
			return;
		}
		var sns = this.sub_nodes;
		var tmp;
		this.isExpand = (flag===undefined?!this.isExpand:flag);
		for(var i=0;i<sns.length;i++){
			tmp = sns[i];
			if(this.isExpand){
				tmp.show();
			}else{
				tmp.hide();
				tmp.expand(false);
			}		
		}

	}
	Node.prototype.addChild = function(n){
		this.sub_nodes.push(n);
	}
	Node.prototype.setIndent = function(){
		var parent = this.parent;
		var count = 0;
		while(parent){
			parent = parent.parent;
			count += 1;
		}
		this.count = count;
		this.indent = count * 25 + 'px';
	}

	/**
	 * tree table 指令创建
	 */
	angular.module('aui.angular-tree', []).
		constant('tableDefault', {
			titleCol:{
				title: '名称',
				width: 550,
				clazz: 'tl-l l-mw'
			},
			sortCol:{
				title: '排序',
				width: 60
			},
			actionCol:{
				title: '操作'
			}
		}).
		directive('treeTable', ['tableDefault', function(tableDefault){
			var nodes = new NodeSet();
			return{
				restrict: 'E',
				scope:{
					btnHandler: '&',
					tree: '='
				},
				template: '<table class="table table-hover">\
							<thead>\
								<tr>\
									<th ng-class="th.clazz" width="{{th.width}}" align="{{th.align}}" ng-repeat="th in ths">{{th.title}}</th>\
								</tr>\
						  	</thead>\
						  	<tbody>\
								<tr ng-repeat="item in nodes track by $index" id="node-{{item.id}}" ng-show="item.isShow">\
									<td class="tl-l"><span class="indent" ng-style="{width:item.indent}"></span><i class="fa fa-angle-down fal tree-cntrl" ng-if="!item.isLeaf" ng-click="expand(item)" ng-class="{expand:item.isExpand}"></i>{{ item.data.name }}</td>\
									<td ng-repeat="prop in props">{{ item.data[prop] }}</td>\
									<td ng-if="btns && btns.length > 0">\
										<a class="btn btn-link" ng-repeat="btn in btns" ng-click="btnClick(item, btn)" ng-if="btn.expression(item)">{{btn.name}}</a>\
									</td>\
									<td ng-if="sortable"><i class="fa fa-align-justify fa-2x fal sort-btn"></i></td>\
								</tr>\
						  	</tbody>\
						  </table>',
				controller:function($scope, $element, $attrs, $transclude){
					$scope.sortable = ('sortable' in $attrs); // 是否支持拖曳排序

					//初始化表头(thead)
					var ths = angular.copy($scope.tree.thead);
					$scope.ths = ((ths&&ths.length>0)?ths:[]);

					var cusCols = angular.copy($scope.ths); //这里获得自定义的列表头数据，将用于判断表格数据展示

					$scope.ths.splice(0, 0, tableDefault.titleCol);//添加固定的名称列
					if($scope.sortable){
						$scope.ths.push(tableDefault.sortCol);
					}

					$scope.btns = angular.copy($scope.tree.btns);
					if($scope.btns && $scope.btns.length > 0){
						if($scope.ths.length > 1){
							$scope.ths.splice($scope.ths.length - 1, 0, tableDefault.actionCol);
						}else{
							$scope.ths.push(tableDefault.actionCol);
						}
						angular.forEach($scope.btns, function(btn, i){
							btn.expression = new Function('node', 'return ' + btn.expression + ';');
						});
						$scope.btnClick = function(node, btn){
							$scope.btnHandler({node:node, type:btn.fn_type});	
						}
					}

					$scope.data = $scope.tree.data;
					$scope.nodes = nodes.setDatas($scope.data);

					//除去固定行剩余需要展示的自定义行，当props设定少于ths时，则去取该列表头title
					var tmpProps = $scope.tree.props;
					$scope.props = [];
					if(tmpProps && tmpProps.length > 0){
						angular.forEach(cusCols, function(col, i){
							$scope.props.push((tmpProps[i]===undefined?col.title:tmpProps[i]));
						});
					}

					$scope.$watch(function(){
						return $scope.tree.data;
					}, function(n, o){
						$scope.data = angular.copy(n);
						$scope.nodes = nodes.setDatas($scope.data);
					});

					$scope.expand = function(node){
						if(node.isLeaf){
							return;
						}
						node.expand();
					}
				},
				link:function(scope, ele, attr, controller){
					if(scope.sortable){
						var move = new Move({colspan: scope.ths.length});
						var $container = ele;
						var $parent;
						var nodeId;
						var brother_nodes;
						var mousemove_hanlder = function(e){
							if(!move.move_enabled){
								return;
							}
							var mx = e.pageX;
							var my = e.pageY;
							move.startMove(mx, my);

							var node = move.compare(brother_nodes);

							if(!node || !node.tmp){return;}
							if(node.tmp.node.isExpand){
								scope.$apply(function(){
									node.tmp.node.expand(false);
								});
								nodes.resetRect($container,brother_nodes);
							}
							var $hover_curr = $container.find('#' + node.tmp.id);
							if(node.before){
								$(move.$place).insertBefore($hover_curr);
							}else{
								$(move.$place).insertAfter($hover_curr);
							}
							move.to = node;
						};
						var mouseup_handler = function(e){
							$(document).off('mousemove mouseup');
							if(!move.move_enabled){
								return;
							}
							var sortData = move.getSortData();
							nodes.resetSort(sortData);
							scope.$apply(function(){
								scope.nodes = nodes.nodes;
							});
							scope.$emit('treeTable.sortChange', sortData);
							move.reset();
							$parent && ($parent.css({
								boxShadow: 'none'
							}));
							$parent = null;

						};
						ele.on('mousedown', '.sort-btn', function(e){
							$parent = $(this).parents('tr');
							nodeId = $parent[0].id;
							move.from = nodes.getNodeById(nodeId.replace('node-', ''));
							scope.$apply(function(){
								move.from.expand(false);
							});
							brother_nodes = nodes.getEqLevel($container, nodeId);

							if(brother_nodes.length < 1){
								return;
							}
							$parent.css({
								boxShadow: '0 0 5px rgba(255, 152, 0, .8)'
							});
							var tmp = $parent[0].getBoundingClientRect();
							var t = tmp.top + window.pageYOffset;
							var l = tmp.left + window.pageXOffset;

							move.setTarget(tmp);

							var px = e.pageX;
							var py = e.pageY;

							move.setStart(px, py);
							move.move_enabled = true;

							$(document).on('mousemove', mousemove_hanlder);

							$(document).on('mouseup', mouseup_handler);
						});

					}
				}
			}
		}]);

}(window, window.angular));