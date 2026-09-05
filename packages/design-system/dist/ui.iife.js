var DesignSystemUI = (function(exports, vue, element_plus) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region ui/UiShell.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$7 = { class: "ui-shell__header" };
	var _hoisted_2$7 = { class: "ui-shell__header-left l-inline" };
	var _hoisted_3$7 = { class: "ui-shell__title" };
	var _hoisted_4$7 = { class: "ui-shell__header-right l-cluster" };
	var _hoisted_5$6 = {
		key: 0,
		class: "ui-shell__group"
	};
	var _hoisted_6$4 = {
		class: "el-icon",
		"aria-hidden": "true"
	};
	var _hoisted_7$2 = {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round",
		"stroke-linejoin": "round"
	};
	var _hoisted_8$2 = ["d"];
	var _hoisted_9$1 = {
		key: 0,
		class: "ui-shell__badge"
	};
	var _hoisted_10$1 = {
		key: 0,
		class: "ui-shell__group"
	};
	var _hoisted_11$1 = {
		class: "el-icon",
		"aria-hidden": "true"
	};
	var _hoisted_12$1 = {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round",
		"stroke-linejoin": "round"
	};
	var _hoisted_13 = ["d"];
	var _hoisted_14 = {
		key: 0,
		class: "ui-shell__badge"
	};
	var _hoisted_15 = { class: "ui-shell__main" };
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
			const ICONS = {
				dashboard: "M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z",
				map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
				monitor: "M3 12h4l2-6 3 12 3-9 2 3h4",
				alarm: "M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Zm-2 16a2 2 0 0 0 4 0",
				incident: "M12 3 2 20h20L12 3Zm0 6v5m0 3h.01",
				enterprise: "M4 21V7l7-4 7 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01",
				emergency: "M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Zm0 6v5m0 3h.01",
				device: "M5 4h14v10H5V4Zm3 14h8m-4-4v4M9 8h6",
				quality: "M4 7h16M4 12h10M4 17h7m6 1 2 2 4-4",
				stats: "M4 20V10m5 10V4m5 16v-7m5 7V8",
				settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 1-.1 1.2l2 1.6-2 3.4-2.4-1a8 8 0 0 1-2 1.2l-.4 2.6h-4l-.4-2.6a8 8 0 0 1-2-1.2l-2.4 1-2-3.4 2-1.6A8 8 0 0 1 4 12c0-.4 0-.8.1-1.2l-2-1.6 2-3.4 2.4 1a8 8 0 0 1 2-1.2L8.9 3h4l.4 2.6a8 8 0 0 1 2 1.2l2.4-1 2 3.4-2 1.6c.1.4.1.8.1 1.2Z",
				default: "M5 12h14"
			};
			const iconPath = (item) => ICONS[item.icon ?? "default"] ?? ICONS.default;
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
					(0, vue.createElementVNode)("header", _hoisted_1$7, [(0, vue.createElementVNode)("div", _hoisted_2$7, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
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
					}), (0, vue.renderSlot)(_ctx.$slots, "logo", {}, () => [_cache[3] || (_cache[3] = (0, vue.createElementVNode)("span", { class: "ui-shell__mark" }, null, -1)), (0, vue.createElementVNode)("span", _hoisted_3$7, (0, vue.toDisplayString)(__props.title), 1)])]), (0, vue.createElementVNode)("div", _hoisted_4$7, [(0, vue.renderSlot)(_ctx.$slots, "header-actions")])]),
					!isMobile.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("aside", {
						key: 0,
						class: (0, vue.normalizeClass)(["ui-shell__sidebar", { "is-collapsed": __props.collapsed }]),
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
								return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: item.key }, [item.group ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_5$6, (0, vue.toDisplayString)(item.group), 1)) : (0, vue.createCommentVNode)("", true), (0, vue.createVNode)((0, vue.unref)(element_plus.ElMenuItem), {
									index: item.key,
									disabled: item.disabled
								}, {
									title: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(item.label), 1), item.badge ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_9$1, (0, vue.toDisplayString)(item.badge), 1)) : (0, vue.createCommentVNode)("", true)]),
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", _hoisted_6$4, [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_7$2, [(0, vue.createElementVNode)("path", { d: iconPath(item) }, null, 8, _hoisted_8$2)]))])]),
									_: 2
								}, 1032, ["index", "disabled"])], 64);
							}), 128))]),
							_: 1
						}, 8, ["default-active", "collapse"])]),
						_: 1
					})], 6)) : ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElDrawer), {
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
									return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: item.key }, [item.group ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_10$1, (0, vue.toDisplayString)(item.group), 1)) : (0, vue.createCommentVNode)("", true), (0, vue.createVNode)((0, vue.unref)(element_plus.ElMenuItem), {
										index: item.key,
										disabled: item.disabled
									}, {
										title: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(item.label), 1), item.badge ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_14, (0, vue.toDisplayString)(item.badge), 1)) : (0, vue.createCommentVNode)("", true)]),
										default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("span", _hoisted_11$1, [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_12$1, [(0, vue.createElementVNode)("path", { d: iconPath(item) }, null, 8, _hoisted_13)]))])]),
										_: 2
									}, 1032, ["index", "disabled"])], 64);
								}), 128))]),
								_: 1
							}, 8, ["default-active"])]),
							_: 1
						})]),
						_: 1
					}, 8, ["modelValue"])),
					(0, vue.createElementVNode)("main", _hoisted_15, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElScrollbar), {
						ref_key: "mainScroll",
						ref: mainScroll,
						class: "ui-shell__scroll",
						"view-class": "ui-shell__view",
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
	var _hoisted_1$6 = { class: "ui-page-header l-page-header" };
	var _hoisted_2$6 = { class: "ui-page-header__text" };
	var _hoisted_3$6 = {
		key: 0,
		class: "ui-page-header__crumb l-inline"
	};
	var _hoisted_4$6 = { key: 1 };
	var _hoisted_5$5 = { class: "l-cluster l-cluster--end" };
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
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$6, [(0, vue.createElementVNode)("div", _hoisted_2$6, [
					_ctx.$slots.breadcrumb ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_3$6, [(0, vue.renderSlot)(_ctx.$slots, "breadcrumb")])) : (0, vue.createCommentVNode)("", true),
					(0, vue.createElementVNode)("h1", null, (0, vue.toDisplayString)(__props.title), 1),
					__props.subtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4$6, (0, vue.toDisplayString)(__props.subtitle), 1)) : (0, vue.createCommentVNode)("", true)
				]), (0, vue.createElementVNode)("div", _hoisted_5$5, [(0, vue.renderSlot)(_ctx.$slots, "actions")])]);
			};
		}
	});
	//#endregion
	//#region ui/UiState.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$5 = { class: "ui-state" };
	var _hoisted_2$5 = {
		key: 2,
		class: "ui-state__error l-state"
	};
	var _hoisted_3$5 = { class: "ui-state__error-title" };
	var _hoisted_4$5 = { class: "ui-state__error-hint" };
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
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$5, [__props.state === "loading" ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElSkeleton), {
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
				}, 8, ["description"])) : __props.state === "error" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_2$5, [
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
					(0, vue.createElementVNode)("strong", _hoisted_3$5, (0, vue.toDisplayString)(__props.errorText), 1),
					(0, vue.createElementVNode)("small", _hoisted_4$5, (0, vue.toDisplayString)(__props.errorHint), 1),
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
	//#region ui/UiTuner.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$4 = {
		key: 0,
		class: "ui-tuner__n"
	};
	var _hoisted_2$4 = { class: "ui-tuner__label" };
	var _hoisted_3$4 = {
		key: 0,
		class: "ui-tuner__n"
	};
	var _hoisted_4$4 = { class: "ui-tuner__acts" };
	var _hoisted_5$4 = { class: "ui-tuner__head" };
	var _hoisted_6$3 = { class: "ui-tuner__body" };
	var _hoisted_7$1 = { class: "ui-tuner__title" };
	var _hoisted_8$1 = ["title"];
	var _hoisted_9 = {
		key: 0,
		class: "ui-tuner__ctl"
	};
	var _hoisted_10 = {
		key: 1,
		class: "ui-tuner__ctl"
	};
	var _hoisted_11 = {
		key: 0,
		class: "ui-tuner__empty"
	};
	var _hoisted_12 = { class: "ui-tuner__foot" };
	//#endregion
	//#region ui/UiTuner.vue
	var UiTuner_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiTuner",
		props: { title: { default: "调参 · 第一层" } },
		setup(__props) {
			/**
			* UiTuner · 第二层 · 调参浮窗
			* 把第一层语义 token 变成实时可调的控件，直接写在 :root 的 inline style 上，整站联动
			* （Element Plus 组件的圆角 / 边框经 --el-* 映射自第一层，不需要单独配）。
			*
			* 之所以做成第二层组件而不是页面里的一段代码：原型（第三层）禁止 <style> 与 inline style，
			* 调参面板必须有自己的样式，只能住在允许写样式的第二层。展示页与任意原型都用 <UiTuner> 接入。
			*
			* token 清单不手工维护：由 dist/tokens.js（window.DS_TOKENS）驱动，改 tokens.css 自动跟着变。
			*/
			const GROUPS = [
				{
					id: "color",
					label: "颜色"
				},
				{
					id: "space",
					label: "间距"
				},
				{
					id: "radius",
					label: "圆角"
				},
				{
					id: "border",
					label: "边框"
				},
				{
					id: "shadow",
					label: "阴影"
				},
				{
					id: "font",
					label: "字体"
				},
				{
					id: "layout",
					label: "布局尺寸"
				},
				{
					id: "z",
					label: "层级"
				}
			];
			const open = (0, vue.ref)(false);
			const min = (0, vue.ref)(false);
			const dragging = (0, vue.ref)(false);
			const query = (0, vue.ref)("");
			const pos = (0, vue.reactive)({
				x: 0,
				y: 0
			});
			const overrides = (0, vue.reactive)({});
			const draft = (0, vue.reactive)({});
			const tick = (0, vue.ref)(0);
			const root = (0, vue.ref)(null);
			const probe = (0, vue.ref)(null);
			/** 只读 window.DS_TOKENS（build:ds 产物）；拿不到就渲染成空清单而不是报错 */
			const tokenGroups = (0, vue.computed)(() => {
				const groups = globalThis.DS_TOKENS?.groups ?? [];
				const q = query.value.trim().toLowerCase();
				return GROUPS.map((g) => ({
					...g,
					tokens: (groups.find((x) => x.id === g.id)?.tokens ?? []).map((x) => x.name).filter((n) => !/^--breakpoint-/.test(n) && (!q || n.includes(q)))
				})).filter((g) => g.tokens.length);
			});
			/** 解析当前生效值：颜色用探针元素取 computed，长度同理 */
			function resolve(name) {
				tick.value;
				const el = probe.value;
				const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
				if (!el) return raw;
				el.removeAttribute("style");
				el.style.backgroundColor = `var(${name})`;
				const bg = getComputedStyle(el).backgroundColor;
				if (bg !== "rgba(0, 0, 0, 0)") return bg;
				el.removeAttribute("style");
				el.style.width = `var(${name})`;
				const w = getComputedStyle(el).width;
				return w === "auto" ? raw : w;
			}
			const shortColor = (v) => {
				const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(v || "");
				return m ? "#" + [
					m[1],
					m[2],
					m[3]
				].map((x) => (+x).toString(16).padStart(2, "0")).join("") : v;
			};
			const pxOf = (v) => {
				const m = /^(-?\d+(?:\.\d+)?)px$/.exec(v || "");
				return m ? Math.round(+m[1]) : 0;
			};
			const isLen = (v) => /^-?\d+(?:\.\d+)?px$/.test(v || "");
			const baseCache = {};
			const valueOf = (n) => overrides[n] ?? resolve(n);
			/** 基线值：首次覆盖时冻结。控件形态与滑块区间只看它，调整过程中不会变形 */
			const baseOf = (n) => n in baseCache ? baseCache[n] : resolve(n);
			const baseRange = (gid, n) => gid === "space" ? [0, 64] : gid === "radius" ? [0, 48] : gid === "border" ? [0, 8] : gid === "font" ? [8, 48] : /^--layout-(header|row|thead|control-h|menu|icon)/.test(n) ? [0, 120] : [0, 480];
			const kindOf = (gid, n) => {
				if (gid === "color") return "color";
				const b = baseOf(n);
				return isLen(b) && pxOf(b) <= baseRange(gid, n)[1] * 3 ? "length" : "text";
			};
			const rangeOf = (gid, n) => {
				const [lo, hi] = baseRange(gid, n);
				const b = pxOf(baseOf(n));
				return [Math.min(lo, b), Math.max(hi, b)];
			};
			const isOn = (n) => n in overrides;
			function setOverride(n, v) {
				if (!(n in baseCache)) baseCache[n] = resolve(n);
				overrides[n] = v;
				document.documentElement.style.setProperty(n, v);
			}
			function resetOne(n) {
				delete overrides[n];
				delete baseCache[n];
				document.documentElement.style.removeProperty(n);
				tick.value++;
			}
			function resetAll() {
				for (const n of Object.keys(overrides)) {
					document.documentElement.style.removeProperty(n);
					delete baseCache[n];
					delete overrides[n];
				}
				tick.value++;
			}
			/** 只有真的变了才写，挡住控件回吐同值触发的空写 */
			const onSlide = (n, v) => {
				const next = `${v}px`;
				if (next !== valueOf(n)) setOverride(n, next);
			};
			const draftValue = (n) => n in draft ? draft[n] : shortColor(valueOf(n));
			const onDraft = (n, v) => {
				draft[n] = v;
			};
			function commitDraft(n) {
				if (!(n in draft)) return;
				const v = String(draft[n]).trim();
				delete draft[n];
				if (!v) return resetOne(n);
				if (v !== valueOf(n)) {
					setOverride(n, v);
					tick.value++;
				}
			}
			const count = (0, vue.computed)(() => Object.keys(overrides).length);
			const cssText = () => `:root {\n${Object.entries(overrides).map(([n, v]) => `  ${n}: ${v};`).join("\n")}\n}`;
			async function copyCss() {
				const text = cssText();
				try {
					await navigator.clipboard.writeText(text);
				} catch {}
			}
			const style = (0, vue.computed)(() => pos.x || pos.y ? {
				left: `${pos.x}px`,
				top: `${pos.y}px`,
				right: "auto",
				bottom: "auto"
			} : {});
			let from = null;
			function clamp(x, y) {
				const pad = 8;
				const r = root.value?.getBoundingClientRect();
				const w = r?.width ?? 0;
				const h = r?.height ?? 40;
				return {
					x: Math.min(Math.max(pad, x), Math.max(pad, window.innerWidth - w - pad)),
					y: Math.min(Math.max(pad, y), Math.max(pad, window.innerHeight - h - pad))
				};
			}
			function onMove(e) {
				if (from) Object.assign(pos, clamp(e.clientX - from.dx, e.clientY - from.dy));
			}
			function onUp() {
				from = null;
				dragging.value = false;
				window.removeEventListener("pointermove", onMove);
			}
			function onDown(e) {
				if (e.target.closest(".ui-tuner__acts")) return;
				const r = root.value?.getBoundingClientRect();
				if (r && !pos.x && !pos.y) {
					pos.x = Math.round(r.x);
					pos.y = Math.round(r.y);
				}
				from = {
					dx: e.clientX - pos.x,
					dy: e.clientY - pos.y
				};
				dragging.value = true;
				window.addEventListener("pointermove", onMove);
				window.addEventListener("pointerup", onUp, { once: true });
			}
			const onResize = () => {
				if (open.value && (pos.x || pos.y)) Object.assign(pos, clamp(pos.x, pos.y));
			};
			(0, vue.onMounted)(() => window.addEventListener("resize", onResize));
			(0, vue.onBeforeUnmount)(() => {
				window.removeEventListener("resize", onResize);
				window.removeEventListener("pointermove", onMove);
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
					(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
						class: "ui-tuner__entry",
						size: "small",
						onClick: _cache[0] || (_cache[0] = ($event) => {
							open.value = true;
							min.value = false;
						})
					}, {
						default: (0, vue.withCtx)(() => [_cache[5] || (_cache[5] = (0, vue.createTextVNode)(" 调参", -1)), count.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_1$4, (0, vue.toDisplayString)(count.value), 1)) : (0, vue.createCommentVNode)("", true)]),
						_: 1
					}),
					open.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						ref_key: "root",
						ref: root,
						class: (0, vue.normalizeClass)(["ui-tuner", {
							"is-min": min.value,
							"is-dragging": dragging.value
						}]),
						style: (0, vue.normalizeStyle)(style.value)
					}, [
						(0, vue.createElementVNode)("div", {
							class: "ui-tuner__bar",
							onPointerdown: onDown
						}, [
							(0, vue.createElementVNode)("span", _hoisted_2$4, (0, vue.toDisplayString)(__props.title), 1),
							count.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_3$4, (0, vue.toDisplayString)(count.value) + " 项已改", 1)) : (0, vue.createCommentVNode)("", true),
							(0, vue.createElementVNode)("span", _hoisted_4$4, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
								text: "",
								size: "small",
								onClick: _cache[1] || (_cache[1] = ($event) => min.value = !min.value)
							}, {
								default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(min.value ? "展开" : "收起"), 1)]),
								_: 1
							}), (0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
								text: "",
								size: "small",
								onClick: _cache[2] || (_cache[2] = ($event) => open.value = false)
							}, {
								default: (0, vue.withCtx)(() => [..._cache[6] || (_cache[6] = [(0, vue.createTextVNode)("关闭", -1)])]),
								_: 1
							})])
						], 32),
						(0, vue.withDirectives)((0, vue.createElementVNode)("div", _hoisted_5$4, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElInput), {
							modelValue: query.value,
							"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => query.value = $event),
							size: "small",
							placeholder: "筛选 token，如 radius / module / border",
							clearable: ""
						}, null, 8, ["modelValue"]), _cache[7] || (_cache[7] = (0, vue.createElementVNode)("small", null, [
							(0, vue.createTextVNode)("改动写在 "),
							(0, vue.createElementVNode)("code", null, ":root"),
							(0, vue.createTextVNode)(" 的 inline style 上，整站实时联动；会压过深浅模式与配色预设，看完记得「全部重置」。值格可直接打字，清空即恢复默认。")
						], -1))], 512), [[vue.vShow, !min.value]]),
						(0, vue.withDirectives)((0, vue.createVNode)((0, vue.unref)(element_plus.ElScrollbar), { class: "ui-tuner__scroll" }, {
							default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_6$3, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(tokenGroups.value, (g) => {
								return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
									key: g.id,
									class: "ui-tuner__group"
								}, [(0, vue.createElementVNode)("div", _hoisted_7$1, [(0, vue.createTextVNode)((0, vue.toDisplayString)(g.label), 1), (0, vue.createElementVNode)("span", null, (0, vue.toDisplayString)(g.tokens.length), 1)]), ((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(g.tokens, (n) => {
									return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
										key: n,
										class: (0, vue.normalizeClass)(["ui-tuner__row", {
											"is-text": kindOf(g.id, n) === "text",
											"is-on": isOn(n)
										}])
									}, [
										(0, vue.createElementVNode)("span", {
											class: "ui-tuner__name",
											title: n
										}, (0, vue.toDisplayString)(n), 9, _hoisted_8$1),
										kindOf(g.id, n) === "color" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_9, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElColorPicker), {
											"model-value": valueOf(n),
											size: "small",
											"show-alpha": "",
											"onUpdate:modelValue": (v) => v ? (setOverride(n, v), tick.value++) : resetOne(n)
										}, null, 8, ["model-value", "onUpdate:modelValue"])])) : kindOf(g.id, n) === "length" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", _hoisted_10, [(0, vue.createVNode)((0, vue.unref)(element_plus.ElSlider), {
											"model-value": pxOf(valueOf(n)),
											min: rangeOf(g.id, n)[0],
											max: rangeOf(g.id, n)[1],
											step: 1,
											"show-tooltip": false,
											size: "small",
											onInput: (v) => onSlide(n, v),
											onChange: _cache[4] || (_cache[4] = ($event) => tick.value++)
										}, null, 8, [
											"model-value",
											"min",
											"max",
											"onInput"
										])])) : (0, vue.createCommentVNode)("", true),
										(0, vue.createVNode)((0, vue.unref)(element_plus.ElInput), {
											class: "ui-tuner__in",
											"model-value": draftValue(n),
											size: "small",
											"onUpdate:modelValue": (v) => onDraft(n, v),
											onChange: ($event) => commitDraft(n),
											onBlur: ($event) => commitDraft(n)
										}, null, 8, [
											"model-value",
											"onUpdate:modelValue",
											"onChange",
											"onBlur"
										])
									], 2);
								}), 128))]);
							}), 128)), !tokenGroups.value.length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_11, "没有匹配的 token；确认已引入 dist/tokens.js。")) : (0, vue.createCommentVNode)("", true)])]),
							_: 1
						}, 512), [[vue.vShow, !min.value]]),
						(0, vue.withDirectives)((0, vue.createElementVNode)("div", _hoisted_12, [
							(0, vue.createElementVNode)("small", null, (0, vue.toDisplayString)(count.value) + " 项已改", 1),
							(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
								size: "small",
								disabled: !count.value,
								onClick: resetAll
							}, {
								default: (0, vue.withCtx)(() => [..._cache[8] || (_cache[8] = [(0, vue.createTextVNode)("全部重置", -1)])]),
								_: 1
							}, 8, ["disabled"]),
							(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
								size: "small",
								type: "primary",
								disabled: !count.value,
								onClick: copyCss
							}, {
								default: (0, vue.withCtx)(() => [..._cache[9] || (_cache[9] = [(0, vue.createTextVNode)("复制为 tokens.css", -1)])]),
								_: 1
							}, 8, ["disabled"])
						], 512), [[vue.vShow, !min.value]])
					], 6)) : (0, vue.createCommentVNode)("", true),
					(0, vue.createElementVNode)("span", {
						ref_key: "probe",
						ref: probe,
						class: "ui-tuner__probe"
					}, null, 512)
				], 64);
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
	var _hoisted_5$3 = { class: "ui-list-item__trailing l-cluster" };
	var _hoisted_6$2 = {
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
				})) : (0, vue.createCommentVNode)("", true)]), (0, vue.createElementVNode)("span", _hoisted_2$3, [(0, vue.createElementVNode)("strong", _hoisted_3$3, (0, vue.toDisplayString)(__props.title), 1), __props.subtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_4$3, (0, vue.toDisplayString)(__props.subtitle), 1)) : (0, vue.createCommentVNode)("", true)])]), (0, vue.createElementVNode)("span", _hoisted_5$3, [
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
					__props.clickable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_6$2, [..._cache[1] || (_cache[1] = [(0, vue.createElementVNode)("path", { d: "M9 6l6 6-6 6" }, null, -1)])])) : (0, vue.createCommentVNode)("", true)
				])], 2);
			};
		}
	});
	//#endregion
	//#region ui/composites/UiFilterBar.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$2 = { class: "ui-filter-bar l-toolbar" };
	var _hoisted_2$2 = { class: "ui-filter-bar__filters l-cluster" };
	var _hoisted_3$2 = { class: "ui-filter-bar__btns l-cluster" };
	var _hoisted_4$2 = { class: "ui-filter-bar__adv-body l-stack l-stack--tight" };
	var _hoisted_5$2 = { class: "ui-filter-bar__right l-cluster l-cluster--end" };
	var _hoisted_6$1 = {
		key: 0,
		class: "ui-filter-bar__summary"
	};
	//#endregion
	//#region ui/composites/UiFilterBar.vue
	var UiFilterBar_default = /* @__PURE__ */ (0, vue.defineComponent)({
		__name: "UiFilterBar",
		props: {
			searchable: {
				type: Boolean,
				default: true
			},
			resettable: {
				type: Boolean,
				default: true
			},
			advanced: {
				type: Boolean,
				default: false
			},
			searchText: { default: "搜索" },
			resetText: { default: "重置" },
			advancedText: { default: "高级搜索" }
		},
		emits: [
			"search",
			"reset",
			"toggle"
		],
		setup(__props, { emit: __emit }) {
			/**
			* UiFilterBar · 第二层 · 复合组件（对齐参考 PuiSearch）
			* 表格 / 列表上方筛选条：整条包在 --color-bg-subtle 圆角容器里。
			* 默认插槽放「label + 控件」对（用 <span class="l-inline"><small>标签</small><el-input/></span>），
			* 右侧依次：搜索（primary）/ 重置 / 高级搜索（文字链接，可选）；summary 摘要；actions 操作按钮。
			* 高级搜索用浮窗承载（#advanced 插槽），展开不改变筛选条高度，表格区不会被推下去。
			*/
			/** toggle 带上浮窗当前的展开状态；无 #advanced 插槽时退化为无参数的点击事件 */
			const emit = __emit;
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$2, [(0, vue.createElementVNode)("span", _hoisted_2$2, [(0, vue.renderSlot)(_ctx.$slots, "default"), (0, vue.createElementVNode)("span", _hoisted_3$2, [
					__props.searchable ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElButton), {
						key: 0,
						type: "primary",
						onClick: _cache[0] || (_cache[0] = ($event) => emit("search"))
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.searchText), 1)]),
						_: 1
					})) : (0, vue.createCommentVNode)("", true),
					__props.resettable ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElButton), {
						key: 1,
						onClick: _cache[1] || (_cache[1] = ($event) => emit("reset"))
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.resetText), 1)]),
						_: 1
					})) : (0, vue.createCommentVNode)("", true),
					__props.advanced && _ctx.$slots.advanced ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElPopover), {
						key: 2,
						trigger: "click",
						placement: "bottom-start",
						width: "auto",
						"popper-class": "ui-filter-bar__adv",
						"onUpdate:visible": _cache[2] || (_cache[2] = (open) => emit("toggle", open))
					}, {
						reference: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(element_plus.ElButton), {
							link: "",
							type: "primary"
						}, {
							default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.advancedText), 1)]),
							_: 1
						})]),
						default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_4$2, [(0, vue.renderSlot)(_ctx.$slots, "advanced")])]),
						_: 3
					})) : __props.advanced ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(element_plus.ElButton), {
						key: 3,
						link: "",
						type: "primary",
						onClick: _cache[3] || (_cache[3] = ($event) => emit("toggle"))
					}, {
						default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(__props.advancedText), 1)]),
						_: 1
					})) : (0, vue.createCommentVNode)("", true)
				])]), (0, vue.createElementVNode)("span", _hoisted_5$2, [_ctx.$slots.summary ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("small", _hoisted_6$1, [(0, vue.renderSlot)(_ctx.$slots, "summary")])) : (0, vue.createCommentVNode)("", true), (0, vue.renderSlot)(_ctx.$slots, "actions")])]);
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
		UiTuner: UiTuner_default,
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
	exports.UiTuner = UiTuner_default;
	exports.components = components;
	exports.default = DesignSystemUI;
	exports.install = install;
	return exports;
})({}, Vue, ElementPlus);
