'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fieldBase = require('@atlaskit/field-base');

var _fieldBase2 = _interopRequireDefault(_fieldBase);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilSharedStyles = require('@atlaskit/util-shared-styles');

var _reactTextareaAutosize = require('react-textarea-autosize');

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

var _droplist = require('@atlaskit/droplist');

var _droplist2 = _interopRequireDefault(_droplist);

var _checkCircle = require('@atlaskit/icon/glyph/check-circle');

var _checkCircle2 = _interopRequireDefault(_checkCircle);

var _crossCircle = require('@atlaskit/icon/glyph/cross-circle');

var _crossCircle2 = _interopRequireDefault(_crossCircle);

var _jqlAutocomplete = require('@deviniti/jql-autocomplete');

var _jqlAutocomplete2 = _interopRequireDefault(_jqlAutocomplete);

var _styled = require('./styled/styled');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function JqlInvalidIcon() {
    return _react2.default.createElement(_crossCircle2.default, { size: 'medium', primaryColor: _utilSharedStyles.akColorR400, label: 'JQL valid' });
}

function JqlValidIcon() {
    return _react2.default.createElement(_checkCircle2.default, { size: 'medium', primaryColor: _utilSharedStyles.akColorG400, label: 'JQL invalid' });
}

var JQLAutocompleteInput = function (_PureComponent) {
    _inherits(JQLAutocompleteInput, _PureComponent);

    function JQLAutocompleteInput() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, JQLAutocompleteInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = JQLAutocompleteInput.__proto__ || Object.getPrototypeOf(JQLAutocompleteInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            jql: _this.props.initialValue,
            isOpen: false,
            suggestions: []
        }, _this.setSuggestions = function (suggestions) {
            _this.setState({ suggestions: [].concat(_toConsumableArray(suggestions)) });
        }, _this.renderItems = function () {
            return _this.state.suggestions.map(function (item, index) {
                var createMarkup = function createMarkup() {
                    return { __html: item.text };
                };
                var ItemText = function ItemText() {
                    return _react2.default.createElement('span', { dangerouslySetInnerHTML: createMarkup() });
                };
                return _react2.default.createElement(
                    _droplist.Item,
                    { onActivate: function onActivate() {
                            return _this.handleItemSelect(item);
                        },
                        isFocused: index === _this.state.focusedItemIndex,
                        key: item.text,
                        type: 'option'
                    },
                    _react2.default.createElement(ItemText, null)
                );
            });
        }, _this.handleKeyboardInteractions = function (event) {
            var isSelectOpen = _this.state.isOpen;
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (!isSelectOpen) {
                        _this.onOpenChange({ event: event, isOpen: true });
                    }
                    _this.focusNextItem();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (isSelectOpen) {
                        _this.focusPreviousItem();
                    }
                    break;
                case 'Enter':
                    if (isSelectOpen) {
                        if (_this.state.focusedItemIndex !== undefined) {
                            event.preventDefault();
                            _this.handleItemSelect(_this.state.suggestions[_this.state.focusedItemIndex]);
                        } else {
                            _this.onOpenChange({ event: event, isOpen: false });
                        }
                    }
                    break;
                case 'Tab':
                    _this.onOpenChange({ event: event, isOpen: false });
                    break;
                default:
                    return false;
            }
        }, _this.onOpenChange = function (attrs) {
            _this.setState({
                focusedItemIndex: undefined,
                isOpen: attrs.isOpen
            });
        }, _this.focusNextItem = function () {
            var _this$state = _this.state,
                focusedItemIndex = _this$state.focusedItemIndex,
                suggestions = _this$state.suggestions;

            var nextItemIndex = _this.getNextFocusable(focusedItemIndex, suggestions.length);
            _this.setState({
                focusedItemIndex: nextItemIndex
            });
            _this.scrollToFocused(nextItemIndex);
        }, _this.focusPreviousItem = function () {
            var _this$state2 = _this.state,
                focusedItemIndex = _this$state2.focusedItemIndex,
                suggestions = _this$state2.suggestions;

            var nextItemIndex = _this.getPrevFocusable(focusedItemIndex, suggestions.length);
            _this.setState({
                focusedItemIndex: nextItemIndex
            });
            _this.scrollToFocused(nextItemIndex);
        }, _this.getNextFocusable = function (indexItem, length) {
            var currentItem = indexItem;

            if (currentItem === undefined) {
                currentItem = 0;
            } else if (currentItem < length) {
                currentItem += 1;
            } else {
                currentItem = 0;
            }

            return currentItem;
        }, _this.handleItemSelect = function (item) {
            _this.setState({
                focusedItemIndex: undefined,
                isOpen: false
            });
            if (item) {
                item.onClick();
            }
        }, _this.getPrevFocusable = function (indexItem, length) {
            var currentItem = indexItem;

            if (currentItem > 0) {
                currentItem -= 1;
            } else {
                currentItem = length;
            }

            return currentItem;
        }, _this.scrollToFocused = function (index) {
            var scrollable = _this.containerNode.querySelector('[data-role="droplistContent"]');
            var item = void 0;

            if (scrollable && index !== undefined) {
                item = scrollable.querySelectorAll('[data-role="droplistItem"]')[index];
            }

            if (item && scrollable) {
                scrollable.scrollTop = item.offsetTop - scrollable.clientHeight + item.clientHeight;
            }
        }, _this.handleInputChange = function (event) {
            var value = event.target.value;


            if (value.trim() !== _this.props.inputValue) {
                _this.validateInput(event);
                _this.onOpenChange({ event: event, isOpen: true });
                _this.props.onChange(event);
            }
        }, _this.validateRequest = function (value) {
            if (value) {
                _this.jqlTimer = setTimeout(function () {
                    _this.props.validationRequest(value).then(function () {
                        _this.setState({ jqlError: null });
                    }).catch(function (error) {
                        _this.setState({ jqlError: JSON.stringify(error.response.data.errorMessages) });
                    });
                }, 500);
            } else {
                _this.setState({ jqlError: null });
            }
        }, _this.validateInput = function (event) {
            if (_this.jqlTimer) {
                clearTimeout(_this.jqlTimer);
            }
            var jql = event.currentTarget.value;
            _this.validateRequest(jql);
        }, _this.validateWhenComponentDidMount = function (value) {
            _this.validateRequest(value);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(JQLAutocompleteInput, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.constructorData = {
                //API requires jquery... TODO change jql-autocomplete API
                input: (0, _jquery2.default)('#' + this.props.inputId),
                render: this.setSuggestions,
                getSuggestions: (0, _lodash2.default)(function (fieldName, onSuccess) {
                    var fieldValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

                    _this2.props.getSuggestionsRequest(fieldName, fieldValue).then(function (response) {
                        onSuccess(response.data.results);
                    });
                }, 400)
            };
            this.jql = new _jqlAutocomplete2.default(this.constructorData);

            this.props.getAutocompleteDataRequest().then(function (response) {
                _this2.jql.passAutocompleteData(response.data);
            });

            this.validateWhenComponentDidMount(this.props.initialValue);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state,
                isOpen = _state.isOpen,
                suggestions = _state.suggestions;
            var _props = this.props,
                maxHeight = _props.maxHeight,
                shouldFlip = _props.shouldFlip;
            var jqlError = this.state.jqlError;

            var Icon = !jqlError ? _react2.default.createElement(JqlValidIcon, null) : _react2.default.createElement(JqlInvalidIcon, null);
            return _react2.default.createElement(
                'div',
                { style: { width: '100%', cursor: 'default' },
                    onKeyDown: this.handleKeyboardInteractions,
                    ref: function ref(element) {
                        _this3.containerNode = element;
                    }
                },
                _react2.default.createElement(_fieldBase.Label, { label: this.props.label }),
                _react2.default.createElement(
                    _droplist2.default,
                    {
                        isKeyboardInteractionDisabled: true,
                        shouldFitContainer: true,
                        isOpen: isOpen && suggestions.length > 0,
                        onOpenChange: this.onOpenChange,
                        maxHeight: maxHeight,
                        shouldFlip: shouldFlip,
                        trigger: _react2.default.createElement(
                            _styled.FieldBaseWrapper,
                            null,
                            _react2.default.createElement(
                                _fieldBase2.default,
                                {
                                    isPaddingDisabled: true,
                                    isFitContainerWidthEnabled: true,
                                    invalidMessage: jqlError
                                },
                                Icon,
                                _react2.default.createElement(_reactTextareaAutosize2.default, {
                                    defaultValue: this.props.initialValue,
                                    onInput: this.handleInputChange,
                                    autocomplete: 'off',
                                    id: this.props.inputId,
                                    minRows: 2,
                                    style: { paddingLeft: 8, cursor: 'auto', width: '100%' },
                                    ref: function ref(input) {
                                        _this3.textInput = input;
                                    }
                                })
                            )
                        )
                    },
                    _react2.default.createElement(
                        _droplist.Group,
                        null,
                        this.renderItems()
                    )
                )
            );
        }
    }]);

    return JQLAutocompleteInput;
}(_react.PureComponent);

_jqlAutocomplete2.default.propTypes = {
    getSuggestionsRequest: _propTypes2.default.func.isRequired,
    getAutocompleteDataRequest: _propTypes2.default.func.isRequired,
    /** Set the max height of the dropdown list in pixels. */
    maxHeight: _propTypes2.default.number,
    initialValue: _propTypes2.default.string,
    inputId: _propTypes2.default.string.isRequired,
    inputValue: _propTypes2.default.string,
    onChange: _propTypes2.default.func.isRequired,
    label: _propTypes2.default.string,
    shouldFlip: _propTypes2.default.bool,
    validationRequest: _propTypes2.default.func.isRequired
};

_jqlAutocomplete2.default.defaultProps = {
    maxHeight: 400,
    shouldFlip: false,
    initialValue: '',
    inputValue: '',
    label: ''
};

exports.default = JQLAutocompleteInput;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _JQLAutocompleteInput = require('./JQLAutocompleteInput');

var _JQLAutocompleteInput2 = _interopRequireDefault(_JQLAutocompleteInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _JQLAutocompleteInput2.default;
