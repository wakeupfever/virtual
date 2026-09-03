var DesignSystemUI = (function(exports, vue, element_plus) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region ui/UiShell.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$6 = { class: "ui-shell__header" };
	var _hoisted_2$6 = { class: "ui-shell__header-left l-inline" };
	var _hoisted_3$6 = { class: "ui-shell__title" };
	var _hoisted_4$6 = { class: "ui-shell__header-right l-cluster" };
	var _hoisted_5$4 = { class: "ui-shell__main" };
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
		emits: [
			"update:collapsed",
			"select",
			"scroll"
		],
		setup(__props, { expose: __expose, emit: __emit }) {
			/**
			* UiShell · 第二层 · 页面外壳
			* 侧边栏折叠 / 当前菜单高亮 / 小屏下侧边栏变抽屉。
			* 滚动模型（R-043）：外壳固定为视口高，侧栏与主内容区各自在 ElScrollbar 内滚动，window 不滚动。
			* 所有尺寸取自 tokens.css 的 --layout-*，本文件不写任何数值。
			*/
			const props = __props;
			const emit = __emit;
			const isMobile = (0, vue.ref)(false);
			const drawerOpen = (0, vue.ref)(false);
			const mainScroll = (0, vue.ref)(null);
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
			/** 供第三层调用：滚动主区到顶 / 指定位置（如路由切换、锚点） */
			function scrollTo(options) {
				mainScroll.value?.scrollTo(typeof options === "number" ? { top: options } : options);
			}
			__expose({
				scrollTo,
				wrapEl: (0, vue.computed)(() => mainScroll.value?.wrapRef ?? null)
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: (0, vue.normalizeClass)(["ui-shell", {
					"is-collapsed": __props.collapsed,
					"is-mobile": isMobile.value
				}]) }, [
					(0, vue.createElementVNode)("header", _hoisted_1$6, [(0, vue.createElementVNode)("div", _hoisted_2$6, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
						text: "",
						circle: "",
						class: "ui-shell__toggle",
						"aria-label": "切换侧边栏",
						onClick: toggle
					}, {
						default: (0, vue.withCtx)(() => [..._cache[2] || (_cache[2] = [(0, vue.createElementVNode)("svg", {
							viewBox: "0 0 24 24",
							width: "18",
							height: "18",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round"
						}, [(0, vue.createElementVNode)("path", { d: "M4 6h16M4 12h16M4 18h16" })], -1)])]),
						_: 1
					}), (0, vue.renderSlot)(_ctx.$slots, "logo", {}, () => [_cache[3] || (_cache[3] = (0, vue.createElementVNode)("span", { class: "ui-shell__mark" }, null, -1)), (0, vue.createElementVNode)("span", _hoisted_3$6, (0, vue.toDisplayString)(__props.title), 1)])]), (0, vue.createElementVNode)("div", _hoisted_4$6, [(0, vue.renderSlot)(_ctx.$slots, "header-actions")])]),
					!isMobile.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("aside", {
						key: 0,
						class: "ui-shell__sidebar",
						style: (0, vue.normalizeStyle)({ width: sidebarWidth.value })
					}, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElScrollbar), null, {
						default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(element_plus.ElMenu), {
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
						}, 8, ["default-active", "collapse"])]),
						_: 1
					})], 4)) : ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElDrawer), {
						key: 1,
						modelValue: drawerOpen.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => drawerOpen.value = $event),
						direction: "ltr",
						"with-header": false,
						size: "var(--layout-sidebar-w)",
						class: "ui-shell__drawer"
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(element_plus.ElScrollbar), null, {
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
						})]),
						_: 1
					}, 8, ["modelValue"])),
					(0, vue.createElementVNode)("main", _hoisted_5$4, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElScrollbar), {
						ref_key: "mainScroll",
						ref: mainScroll,
						class: "ui-shell__scroll",
						onScroll: _cache[1] || (_cache[1] = (p) => emit("scroll", p))
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.renderSlot)(_ctx.$slots, "default")]),
						_: 3
					}, 512)])
				], 2);
			};
		}
	});
	//#endregion
	//#region ui/UiPageHeader.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$5 = { class: "ui-page-header l-page-header" };
	var _hoisted_2$5 = { class: "ui-page-header__text" };
	var _hoisted_3$5 = {
		key: 0,
		class: "ui-page-header__crumb l-inline"
	};
	var _hoisted_4$5 = { key: 1 };
	var _hoisted_5$3 = { class: "l-cluster l-cluster--end" };
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
			* 面包屑插槽 + 标题 + 副标题 + 右侧操作区。间距由 .l-page-header（第一层）决定。
			*/
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$5, [(0, vue.createElementVNode)("div", _hoisted_2$5, [
					_ctx.$slots.breadcrumb ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_3$5, [(0, vue.renderSlot)(_ctx.$slots, "breadcrumb")])) : (0, vue.createCommentVNode)("", true),
					(0, vue.createElementVNode)("h1", null, (0, vue.toDisplayString)(__props.title), 1),
					__props.subtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4$5, (0, vue.toDisplayString)(__props.subtitle), 1)) : (0, vue.createCommentVNode)("", true)
				]), (0, vue.createElementVNode)("div", _hoisted_5$3, [(0, vue.renderSlot)(_ctx.$slots, "actions")])]);
			};
		}
	});
	//#endregion
	//#region ui/UiState.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$4 = { class: "ui-state" };
	var _hoisted_2$4 = {
		key: 2,
		class: "ui-state__error l-state"
	};
	var _hoisted_3$4 = { class: "ui-state__error-title" };
	var _hoisted_4$4 = { class: "ui-state__error-hint" };
	//#endregion
	//#region ui/UiState.vue
	var UiState_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiState",
		props: {
			state: {},
			emptyText: { default: "暂无数据" },
			errorText: { default: "加载失败" },
			errorHint: { default: "网络异常或服务暂不可用，请稍后重试" },
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
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$4, [__props.state === "loading" ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElSkeleton), {
					key: 0,
					rows: __props.rows,
					animated: ""
				}, null, 8, ["rows"])) : __props.state === "empty" ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElEmpty), {
					key: 1,
					description: __props.emptyText,
					"image-size": 72
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.renderSlot)(_ctx.$slots, "action")]),
					_: 3
				}, 8, ["description"])) : __props.state === "error" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_2$4, [
					_cache[2] || (_cache[2] = (0, vue.createElementVNode)("span", { class: "ui-state__error-icon" }, [(0, vue.createElementVNode)("svg", {
						viewBox: "0 0 24 24",
						width: "18",
						height: "18",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round"
					}, [(0, vue.createElementVNode)("circle", {
						cx: "12",
						cy: "12",
						r: "9"
					}), (0, vue.createElementVNode)("path", { d: "M12 8v5M12 16h.01" })])], -1)),
					(0, vue.createElementVNode)("strong", _hoisted_3$4, (0, vue.toDisplayString)(__props.errorText), 1),
					(0, vue.createElementVNode)("small", _hoisted_4$4, (0, vue.toDisplayString)(__props.errorHint), 1),
					(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
						size: "small",
						onClick: _cache[0] || (_cache[0] = ($event) => emit("retry"))
					}, {
						default: (0, vue.withCtx)(() => [..._cache[1] || (_cache[1] = [(0, vue.createTextVNode)("重试", -1)])]),
						_: 1
					})
				])) : (0, vue.renderSlot)(_ctx.$slots, "default", {}, void 0, void 0, 3)]);
			};
		}
	});
	//#endregion
	//#region ui/composites/UiListItem.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$3 = { class: "ui-list-item__main l-inline" };
	var _hoisted_2$3 = { class: "ui-list-item__text l-stack l-stack--tight" };
	var _hoisted_3$3 = { class: "ui-list-item__title" };
	var _hoisted_4$3 = {
		key: 0,
		class: "ui-list-item__subtitle"
	};
	var _hoisted_5$2 = { class: "ui-list-item__trailing l-cluster" };
	var _hoisted_6$1 = {
		key: 1,
		class: "ui-list-item__chevron",
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round"
	};
	//#endregion
	//#region ui/composites/UiListItem.vue
	var UiListItem_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiListItem",
		props: {
			title: {},
			subtitle: { default: "" },
			avatar: { default: "" },
			status: { default: void 0 },
			clickable: {
				type: Boolean,
				default: false
			},
			active: {
				type: Boolean,
				default: false
			},
			divided: {
				type: Boolean,
				default: false
			}
		},
		emits: ["click"],
		setup(__props, { emit: __emit }) {
			/**
			* UiListItem · 第二层 · 复合组件（结构级下沉范例）
			* 结构：[leading: 头像] [标题 / 副标题] …… [trailing: 状态胶囊 + 操作 + 箭头]
			* 由白名单原语 + .l-* 布局类拼成；本文件不写数值，只引用 token。
			*/
			const emit = __emit;
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: (0, vue.normalizeClass)(["ui-list-item l-cluster l-cluster--between", {
						"is-clickable": __props.clickable,
						"is-active": __props.active,
						"is-divided": __props.divided
					}]),
					onClick: _cache[0] || (_cache[0] = ($event) => __props.clickable && emit("click"))
				}, [(0, vue.createElementVNode)("span", _hoisted_1$3, [(0, vue.renderSlot)(_ctx.$slots, "leading", {}, () => [__props.avatar ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElAvatar), {
					key: 0,
					class: "ui-list-item__avatar",
					size: 36
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.avatar.slice(0, 1)), 1)]),
					_: 1
				})) : (0, vue.createCommentVNode)("", true)]), (0, vue.createElementVNode)("span", _hoisted_2$3, [(0, vue.createElementVNode)("strong", _hoisted_3$3, (0, vue.toDisplayString)(__props.title), 1), __props.subtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4$3, (0, vue.toDisplayString)(__props.subtitle), 1)) : (0, vue.createCommentVNode)("", true)])]), (0, vue.createElementVNode)("span", _hoisted_5$2, [
					__props.status ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElTag), {
						key: 0,
						type: __props.status.type || "info",
						size: "small",
						round: ""
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.status.label), 1)]),
						_: 1
					}, 8, ["type"])) : (0, vue.createCommentVNode)("", true),
					(0, vue.renderSlot)(_ctx.$slots, "trailing"),
					__props.clickable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_6$1, [..._cache[1] || (_cache[1] = [(0, vue.createElementVNode)("path", { d: "M9 6l6 6-6 6" }, null, -1)])])) : (0, vue.createCommentVNode)("", true)
				])], 2);
			};
		}
	});
	//#endregion
	//#region ui/composites/UiFilterBar.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$2 = { class: "ui-filter-bar l-toolbar" };
	var _hoisted_2$2 = { class: "ui-filter-bar__filters l-cluster" };
	var _hoisted_3$2 = { class: "ui-filter-bar__right l-cluster l-cluster--end" };
	var _hoisted_4$2 = {
		key: 0,
		class: "ui-filter-bar__summary"
	};
	//#endregion
	//#region ui/composites/UiFilterBar.vue
	var UiFilterBar_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiFilterBar",
		props: {
			resettable: {
				type: Boolean,
				default: true
			},
			resetText: { default: "重置" }
		},
		emits: ["reset"],
		setup(__props, { emit: __emit }) {
			/**
			* UiFilterBar · 第二层 · 复合组件
			* 表格 / 列表上方筛选条：整条包在 --color-bg-subtle 圆角容器里；
			* 默认插槽放筛选控件，summary 插槽放摘要（如"已选 N 项"），actions 插槽放右侧按钮；可选「重置」文字链接。
			*/
			const emit = __emit;
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$2, [(0, vue.createElementVNode)("span", _hoisted_2$2, [(0, vue.renderSlot)(_ctx.$slots, "default"), __props.resettable ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElButton), {
					key: 0,
					link: "",
					type: "primary",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("reset"))
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.resetText), 1)]),
					_: 1
				})) : (0, vue.createCommentVNode)("", true)]), (0, vue.createElementVNode)("span", _hoisted_3$2, [_ctx.$slots.summary ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4$2, [(0, vue.renderSlot)(_ctx.$slots, "summary")])) : (0, vue.createCommentVNode)("", true), (0, vue.renderSlot)(_ctx.$slots, "actions")])]);
			};
		}
	});
	//#endregion
	//#region ui/composites/UiStatCard.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$1 = { class: "ui-stat-card l-module" };
	var _hoisted_2$1 = { class: "ui-stat-card__head" };
	var _hoisted_3$1 = { class: "ui-stat-card__label" };
	var _hoisted_4$1 = {
		key: 0,
		class: "ui-stat-card__icon"
	};
	var _hoisted_5$1 = { class: "ui-stat-card__value l-inline" };
	var _hoisted_6 = { class: "ui-stat-card__num" };
	var _hoisted_7 = {
		key: 0,
		class: "ui-stat-card__unit"
	};
	var _hoisted_8 = {
		key: 0,
		class: "ui-stat-card__hint"
	};
	//#endregion
	//#region ui/composites/UiStatCard.vue
	var UiStatCard_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiStatCard",
		props: {
			label: {},
			value: {},
			unit: { default: "" },
			trend: { default: void 0 },
			hint: { default: "" },
			upIsGood: {
				type: Boolean,
				default: void 0
			}
		},
		setup(__props) {
			/**
			* UiStatCard · 第二层 · 复合组件
			* 统计卡片（对齐参考 StandardStatsMaterial）：标签 + 右上趋势胶囊（或图标插槽）/ 数值 / 说明。
			* 基于 .l-module；所有值只引用 token。
			*/
			const props = __props;
			const display = (0, vue.computed)(() => typeof props.value === "number" ? props.value.toLocaleString("zh-CN") : props.value);
			const trendClass = (0, vue.computed)(() => {
				if (props.trend === void 0) return "";
				if (props.trend === 0) return "is-flat";
				if (props.upIsGood === void 0) return "is-primary";
				return (props.trend > 0 ? props.upIsGood : !props.upIsGood) ? "is-good" : "is-bad";
			});
			const trendText = (0, vue.computed)(() => props.trend === void 0 ? "" : props.trend === 0 ? "持平" : `${props.trend > 0 ? "+" : ""}${props.trend}%`);
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("section", _hoisted_1$1, [
					(0, vue.createElementVNode)("div", _hoisted_2$1, [(0, vue.createElementVNode)("span", _hoisted_3$1, (0, vue.toDisplayString)(__props.label), 1), _ctx.$slots.icon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_4$1, [(0, vue.renderSlot)(_ctx.$slots, "icon")])) : __props.trend !== void 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
						key: 1,
						class: (0, vue.normalizeClass)(["ui-stat-card__trend", trendClass.value])
					}, (0, vue.toDisplayString)(trendText.value), 3)) : (0, vue.createCommentVNode)("", true)]),
					(0, vue.createElementVNode)("div", _hoisted_5$1, [
						(0, vue.createElementVNode)("span", _hoisted_6, (0, vue.toDisplayString)(display.value), 1),
						__props.unit ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_7, (0, vue.toDisplayString)(__props.unit), 1)) : (0, vue.createCommentVNode)("", true),
						_ctx.$slots.icon && __props.trend !== void 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
							key: 1,
							class: (0, vue.normalizeClass)(["ui-stat-card__trend", trendClass.value])
						}, (0, vue.toDisplayString)(trendText.value), 3)) : (0, vue.createCommentVNode)("", true)
					]),
					__props.hint ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_8, (0, vue.toDisplayString)(__props.hint), 1)) : (0, vue.createCommentVNode)("", true),
					(0, vue.renderSlot)(_ctx.$slots, "default")
				]);
			};
		}
	});
	//#endregion
	//#region ui/composites/UiModuleHeader.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1 = { class: "ui-module-header l-module-header" };
	var _hoisted_2 = { class: "ui-module-header__text" };
	var _hoisted_3 = { class: "ui-module-header__title" };
	var _hoisted_4 = {
		key: 0,
		class: "ui-module-header__desc"
	};
	var _hoisted_5 = {
		key: 0,
		class: "ui-module-header__meta l-cluster"
	};
	//#endregion
	//#region ui/composites/UiModuleHeader.vue
	var UiModuleHeader_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiModuleHeader",
		props: {
			title: {},
			desc: {}
		},
		setup(__props) {
			/**
			* UiModuleHeader · 第二层 · 复合组件
			* 模块（卡片）标题行：标题 + 描述 + 右侧 meta 插槽。基于 .l-module-header；间距与字号只引用 token。
			* 来源：五套页面模板中每个模块都出现的同一结构（data-composite="module-header"）。
			*/
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("header", _hoisted_1, [(0, vue.createElementVNode)("div", _hoisted_2, [(0, vue.createElementVNode)("h2", _hoisted_3, (0, vue.toDisplayString)(__props.title), 1), __props.desc ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4, (0, vue.toDisplayString)(__props.desc), 1)) : (0, vue.createCommentVNode)("", true)]), _ctx.$slots.meta ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_5, [(0, vue.renderSlot)(_ctx.$slots, "meta")])) : (0, vue.createCommentVNode)("", true)]);
			};
		}
	});
	//#endregion
	//#region ui/index.ts
	/** 自研组件清单：新增组件必须同时登记到 README.md、whitelist.json（custom）与 showcase.data.js（CUSTOM） */
	var components = {
		UiShell: UiShell_default,
		UiPageHeader: UiPageHeader_default,
		UiState: UiState_default,
		UiListItem: UiListItem_default,
		UiFilterBar: UiFilterBar_default,
		UiStatCard: UiStatCard_default,
		UiModuleHeader: UiModuleHeader_default
	};
	function install(app) {
		for (const [name, comp] of Object.entries(components)) app.component(name, comp);
	}
	var DesignSystemUI = { install };
	//#endregion
	exports.UiFilterBar = UiFilterBar_default;
	exports.UiListItem = UiListItem_default;
	exports.UiModuleHeader = UiModuleHeader_default;
	exports.UiPageHeader = UiPageHeader_default;
	exports.UiShell = UiShell_default;
	exports.UiStatCard = UiStatCard_default;
	exports.UiState = UiState_default;
	exports.components = components;
	exports.default = DesignSystemUI;
	exports.install = install;
	return exports;
})({}, Vue, ElementPlus);
