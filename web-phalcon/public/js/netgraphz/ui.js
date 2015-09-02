//User interface interaction module

var netgraphz = netgraphz || {};
netgraphz.ui = (function(store, settings, renderer, eventBus, $){
	var _publisher = eventBus.registerPublisher("ui");
	var exports = {};
	var $cbFollow;


	var dispatch_node_event = function(topic, e, retopic){
		var regex = new RegExp("n([0-9]+)");
		var matches = regex.exec(e.cyEvent.cyTarget.id());
		if(matches == null || matches.length < 2){
			console.error("Cannot parse node id: %s", e.node_id);
			return;
		}
		var id = parseInt(matches[1]);
		var node = store.getDefaultStorage().getNodeById(id);
		if(typeof node === "undefined"){
			console.error("Node not found in storage, id: %s", oid);
			return;
		}
		_publisher.emit(retopic, {node: node, date: new Date()});
	};

	var attach_events = function(){
		eventBus.subscribe("renderer:default", "node_select", function(topic, e){
			dispatch_node_event(topic, e, "node_select");
		});
		eventBus.subscribe("renderer:default", "node_mouseover", function(topic, e){
			dispatch_node_event(topic, e, "node_mouseover");
		});
		eventBus.subscribe("renderer:default", "node_mouseout", function(topic, e){
			dispatch_node_event(topic, e, "node_mouseout");
		});
		$(function(){
			$("#"+settings.loading_bar_id).hide();
			$(window).resize(function(e){
					_publisher.emitSync("window_resize", {
						domEvent: e,
						time: new Date()
					});
			})
			$(window).keydown(function(e){
					_publisher.emitSync("window_keydown", {
						domEvent: e,
						time: new Date()
					});
			});
			$cbFollow = $("#"+settings.followProblemNodesCheckboxId);
			$('#'+settings.viewPortResetButtonId).click(function(e){
					e.preventDefault();
					renderer.getDefaultRenderer().resetZoomAndCenter();
					$(this).blur();
			});
			$("#"+settings.layoutStartButtonId).click(function(e){
					e.preventDefault();
					renderer.getDefaultRenderer().startLayout();
					$(this).blur();
			});
			$("#"+settings.layoutStopButtonId).click(function(e){
					e.preventDefault();
					renderer.getDefaultRenderer().stopLayout();
					$(this).blur();
			});
		});
	};

	exports.isFollowEnabled = function(){
			return $cbFollow.is(":checked");
	};

	exports.select_node = function(id){
			var node = store.getDefaultStorage().getNodeById(id);
			if( typeof node === "undefined") {
					console.error("Call selectNode() with id: %s  - not found", id);
					return;
			}
			renderer.getDefaultRenderer().select_node(id);
			_publisher.emit("node_select", {
				node: node,
				time: new Date()
			});
	};

	exports.init = function(){
		attach_events();
	};

	return exports;
})(netgraphz.store, netgraphz.settings.ui, netgraphz.renderer, netgraphz.eventBus, $);
