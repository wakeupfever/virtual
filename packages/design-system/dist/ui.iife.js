var DesignSystemUI = (function(exports, vue, element_plus) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region ui/UiShell.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$2 = { class: "ui-shell__header" };
	var _hoisted_2$2 = { class: "ui-shell__header-left l-inline" };
	var _hoisted_3$1 = { class: "ui-shell__title" };
	var _hoisted_4$1 = { class: "ui-shell__header-right l-cluster" };
	var _hoisted_5 = { class: "ui-shell__main" };
	//#endregion
	//#region ui/UiShell.vue
	var UiShell_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiShell",
		props: {
			title: { default: "" },
			menu: { default: () => [] },
			activeKey: { default: "" },
			collapsed: {
				type: Boolean,
				default: false
			}
		},
		emits: ["update:collapsed", "select"],
		setup(__props, { emit: __emit }) {
			/**
			* UiShell · 第二层 · 页面外壳
			* 侧边栏折叠 / 当前菜单高亮 / 小屏下侧边栏变抽屉。
			* 所有尺寸取自 tokens.css 的 --layout-*，本文件不写任何数值。
			*/
			const props = __props;
			const emit = __emit;
			const isMobile = (0, vue.ref)(false);
			const drawerOpen = (0, vue.ref)(false);
			let mql = null;
			function syncMedia() {
				if (!mql) return;
				isMobile.value = mql.matches;
				if (!isMobile.value) drawerOpen.value = false;
			}
			(0, vue.onMounted)(() => {
				const bp = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-md").trim() || "768px";
				mql = window.matchMedia(`(max-width: ${bp})`);
				syncMedia();
				mql.addEventListener("change", syncMedia);
			});
			(0, vue.onBeforeUnmount)(() => mql?.removeEventListener("change", syncMedia));
			const sidebarWidth = (0, vue.computed)(() => props.collapsed ? "var(--layout-sidebar-w-collapsed)" : "var(--layout-sidebar-w)");
			function toggle() {
				if (isMobile.value) drawerOpen.value = !drawerOpen.value;
				else emit("update:collapsed", !props.collapsed);
			}
			function onSelect(key) {
				emit("select", key);
				if (isMobile.value) drawerOpen.value = false;
			}
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: (0, vue.normalizeClass)(["ui-shell", {
					"is-collapsed": __props.collapsed,
					"is-mobile": isMobile.value
				}]) }, [
					(0, vue.createElementVNode)("header", _hoisted_1$2, [(0, vue.createElementVNode)("div", _hoisted_2$2, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
						text: "",
						circle: "",
						class: "ui-shell__toggle",
						"aria-label": "切换侧边栏",
						onClick: toggle
					}, {
						default: (0, vue.withCtx)(() => [..._cache[1] || (_cache[1] = [(0, vue.createElementVNode)("svg", {
							viewBox: "0 0 24 24",
							width: "18",
							height: "18",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round"
						}, [(0, vue.createElementVNode)("path", { d: "M4 6h16M4 12h16M4 18h16" })], -1)])]),
						_: 1
					}), (0, vue.renderSlot)(_ctx.$slots, "logo", {}, () => [(0, vue.createElementVNode)("span", _hoisted_3$1, (0, vue.toDisplayString)(__props.title), 1)])]), (0, vue.createElementVNode)("div", _hoisted_4$1, [(0, vue.renderSlot)(_ctx.$slots, "header-actions")])]),
					!isMobile.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("aside", {
						key: 0,
						class: "ui-shell__sidebar",
						style: (0, vue.normalizeStyle)({ width: sidebarWidth.value })
					}, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElMenu), {
						"default-active": __props.activeKey,
						collapse: __props.collapsed,
						"collapse-transition": false,
						class: "ui-shell__menu",
						onSelect
					}, {
						default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(__props.menu, (item) => {
							return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElMenuItem), {
								key: item.key,
								index: item.key,
								disabled: item.disabled
							}, {
								default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(item.label), 1)]),
								_: 2
							}, 1032, ["index", "disabled"]);
						}), 128))]),
						_: 1
					}, 8, ["default-active", "collapse"])], 4)) : ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElDrawer), {
						key: 1,
						modelValue: drawerOpen.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => drawerOpen.value = $event),
						direction: "ltr",
						"with-header": false,
						size: "var(--layout-sidebar-w)",
						class: "ui-shell__drawer"
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(element_plus.ElMenu), {
							"default-active": __props.activeKey,
							class: "ui-shell__menu",
							onSelect
						}, {
							default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(__props.menu, (item) => {
								return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElMenuItem), {
									key: item.key,
									index: item.key,
									disabled: item.disabled
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(item.label), 1)]),
									_: 2
								}, 1032, ["index", "disabled"]);
							}), 128))]),
							_: 1
						}, 8, ["default-active"])]),
						_: 1
					}, 8, ["modelValue"])),
					(0, vue.createElementVNode)("main", _hoisted_5, [(0, vue.renderSlot)(_ctx.$slots, "default")])
				], 2);
			};
		}
	});
	//#endregion
	//#region ui/UiPageHeader.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$1 = { class: "ui-page-header l-page-header" };
	var _hoisted_2$1 = { class: "ui-page-header__text" };
	var _hoisted_3 = { key: 0 };
	var _hoisted_4 = { class: "l-cluster l-cluster--end" };
	//#endregion
	//#region ui/UiPageHeader.vue
	var UiPageHeader_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiPageHeader",
		props: {
			title: {},
			subtitle: {}
		},
		setup(__props) {
			/**
			* UiPageHeader · 第二层 · 页头
			* 标题 + 副标题 + 右侧操作区。间距由 .l-page-header（第一层）决定。
			*/
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$1, [(0, vue.createElementVNode)("div", _hoisted_2$1, [(0, vue.createElementVNode)("h1", null, (0, vue.toDisplayString)(__props.title), 1), __props.subtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_3, (0, vue.toDisplayString)(__props.subtitle), 1)) : (0, vue.createCommentVNode)("", true)]), (0, vue.createElementVNode)("div", _hoisted_4, [(0, vue.renderSlot)(_ctx.$slots, "actions")])]);
			};
		}
	});
	//#endregion
	//#region ui/UiState.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1 = { class: "ui-state" };
	var _hoisted_2 = {
		key: 2,
		class: "l-state"
	};
	//#endregion
	//#region ui/UiState.vue
	var UiState_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiState",
		props: {
			state: {},
			emptyText: { default: "暂无数据" },
			errorText: { default: "加载失败，请重试" },
			rows: { default: 5 }
		},
		emits: ["retry"],
		setup(__props, { emit: __emit }) {
			/**
			* UiState · 第二层 · 状态容器
			* 统一 loading / empty / error 的呈现；state 为 'ready' 时渲染默认插槽。
			* 原型必须能切换这三种状态（R-018），正式页面接 API 后复用同一组件。
			*/
			const emit = __emit;
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1, [__props.state === "loading" ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElSkeleton), {
					key: 0,
					rows: __props.rows,
					animated: ""
				}, null, 8, ["rows"])) : __props.state === "empty" ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElEmpty), {
					key: 1,
					description: __props.emptyText
				}, null, 8, ["description"])) : __props.state === "error" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_2, [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(__props.errorText), 1), (0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
					size: "small",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("retry"))
				}, {
					default: (0, vue.withCtx)(() => [..._cache[1] || (_cache[1] = [(0, vue.createTextVNode)("重试", -1)])]),
					_: 1
				})])) : (0, vue.renderSlot)(_ctx.$slots, "default", {}, void 0, void 0, 3)]);
			};
		}
	});
	//#endregion
	//#region ui/index.ts
	/** 自研复合组件清单：新增组件必须同时登记到 README.md */
	var components = {
		UiShell: UiShell_default,
		UiPageHeader: UiPageHeader_default,
		UiState: UiState_default
	};
	function install(app) {
		for (const [name, comp] of Object.entries(components)) app.component(name, comp);
	}
	var DesignSystemUI = { install };
	//#endregion
	exports.UiPageHeader = UiPageHeader_default;
	exports.UiShell = UiShell_default;
	exports.UiState = UiState_default;
	exports.components = components;
	exports.default = DesignSystemUI;
	exports.install = install;
	return exports;
})({}, Vue, ElementPlus);
