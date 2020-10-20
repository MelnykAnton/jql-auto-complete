import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FieldBase, { Label } from '@atlaskit/field-base';
import debounce from 'lodash.debounce';
import { akColorG400, akColorR400 } from '@atlaskit/util-shared-styles';
import Input from 'react-textarea-autosize';
import DropList, { Group, Item } from '@atlaskit/droplist';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import JQLAutocomplete from '@deviniti/jql-autocomplete';
import { FieldBaseWrapper } from './styled/styled';
import jQuery from 'jquery';

function JqlInvalidIcon() {
    return (
        <CrossCircleIcon size="medium" primaryColor={akColorR400} label="JQL valid"/>
    );
}

function JqlValidIcon() {
    return (
        <CheckCircleIcon size="medium" primaryColor={akColorG400} label="JQL invalid"/>
    );
}

class JQLAutocompleteInput extends PureComponent {


    state = {
        jql: this.props.initialValue,
        isOpen: false,
        suggestions: []
    };

    componentDidMount() {
        this.constructorData = {
            //API requires jquery... TODO change jql-autocomplete API
            input: jQuery('#' + this.props.inputId),
            render: this.setSuggestions,
            getSuggestions: debounce(
                (fieldName, onSuccess, fieldValue = '') => {
                    this.props.getSuggestionsRequest(fieldName, fieldValue)
                        .then((response) => {
                            onSuccess(response.data.results);
                        });
                }
                , 400)
        };
        this.jql = new JQLAutocomplete(this.constructorData);

        this.props.getAutocompleteDataRequest()
            .then((response) => { this.jql.passAutocompleteData(response.data); });

        this.validateWhenComponentDidMount(this.props.initialValue);
    }

    setSuggestions = (suggestions) => {
        this.setState({ suggestions: [...suggestions] });
    };

    render() {
        const { isOpen, suggestions } = this.state;
        const { maxHeight, shouldFlip } = this.props;
        const { jqlError } = this.state;
        const Icon = !jqlError ? <JqlValidIcon/> : <JqlInvalidIcon/>;
        return (
            <div style={{ width: '100%', cursor: 'default' }}
                 onKeyDown={this.handleKeyboardInteractions}
                 ref={(element) => { this.containerNode = element; }}
            >
                <Label label={this.props.label}/>

                <DropList
                    isKeyboardInteractionDisabled
                    shouldFitContainer
                    isOpen={isOpen && suggestions.length > 0}
                    onOpenChange={this.onOpenChange}
                    maxHeight={maxHeight}
                    shouldFlip={shouldFlip}
                    trigger={
                        <FieldBaseWrapper>
                            <FieldBase
                                isPaddingDisabled={true}
                                isFitContainerWidthEnabled
                                invalidMessage={jqlError}
                            >
                                {Icon}
                                <Input
                                    defaultValue={this.props.initialValue}
                                    onInput={this.handleInputChange}
                                    autocomplete={'off'}
                                    id={this.props.inputId}
                                    minRows={ 2 }
                                    style={{ paddingLeft: 8, cursor: 'auto', width: '100%' }}
                                    ref={(input) => { this.textInput = input; }}
                                />
                            </FieldBase>
                        </FieldBaseWrapper>
                    }
                >
                    <Group>
                        {this.renderItems()}
                    </Group>
                </DropList>
            </div>
        );
    }

    renderItems = () => {
        return this.state.suggestions.map((item, index) => {
            const createMarkup = function () {
                return { __html: item.text };
            };
            const ItemText = function () {
                return <span dangerouslySetInnerHTML={createMarkup()} />;
            };
            return (
                <Item onActivate={() => this.handleItemSelect(item)}
                      isFocused={index === this.state.focusedItemIndex}
                      key={item.text}
                      type="option"
                >
                    <ItemText/>
                </Item>
            );
        });

    };

    handleKeyboardInteractions = (event) => {
        const isSelectOpen = this.state.isOpen;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!isSelectOpen) {
                    this.onOpenChange({ event, isOpen: true });
                }
                this.focusNextItem();
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (isSelectOpen) {
                    this.focusPreviousItem();
                }
                break;
            case 'Enter':
                if (isSelectOpen) {
                    if (this.state.focusedItemIndex !== undefined) {
                        event.preventDefault();
                        this.handleItemSelect(
                            this.state.suggestions[this.state.focusedItemIndex]
                        );
                    } else {
                        this.onOpenChange({ event, isOpen: false });
                    }
                }
                break;
            case 'Tab':
                this.onOpenChange({ event, isOpen: false });
                break;
            default:
                return false;
        }
    };

    onOpenChange = (attrs) => {
        this.setState({
            focusedItemIndex: undefined,
            isOpen: attrs.isOpen
        });
    };


    focusNextItem = () => {
        const { focusedItemIndex, suggestions } = this.state;
        const nextItemIndex = this.getNextFocusable(focusedItemIndex, suggestions.length);
        this.setState({
            focusedItemIndex: nextItemIndex
        });
        this.scrollToFocused(nextItemIndex);
    };

    focusPreviousItem = () => {
        const { focusedItemIndex, suggestions } = this.state;
        const nextItemIndex = this.getPrevFocusable(focusedItemIndex, suggestions.length);
        this.setState({
            focusedItemIndex: nextItemIndex
        });
        this.scrollToFocused(nextItemIndex);
    };

    getNextFocusable = (indexItem, length) => {
        let currentItem = indexItem;

        if (currentItem === undefined) {
            currentItem = 0;
        } else if (currentItem < length) {
            currentItem += 1;
        } else {
            currentItem = 0;
        }

        return currentItem;
    };

    handleItemSelect = (item) => {
        this.setState({
            focusedItemIndex: undefined,
            isOpen: false
        });
        if (item) {
            item.onClick();
        }
    };

    getPrevFocusable = (indexItem, length) => {
        let currentItem = indexItem;

        if (currentItem > 0) {
            currentItem -= 1;
        } else {
            currentItem = length;
        }

        return currentItem;
    };

    scrollToFocused = (index) => {
        const scrollable = this.containerNode.querySelector('[data-role="droplistContent"]');
        let item;

        if (scrollable && index !== undefined) {
            item = scrollable.querySelectorAll('[data-role="droplistItem"]')[index];
        }

        if (item && scrollable) {
            scrollable.scrollTop = (item.offsetTop - scrollable.clientHeight) + item.clientHeight;
        }
    };

    handleInputChange = (event) => {
        const { value } = event.target;

        if (value.trim() !== this.props.inputValue) {
            this.validateInput(event);
            this.onOpenChange({ event, isOpen: true });
            this.props.onChange(event);
        }
    };
    validateRequest = (value) => {
        if (value) {
            this.jqlTimer = setTimeout(() => {
                this.props.validationRequest(value)
                    .then(() => {
                        this.setState({ jqlError: null });
                    })
                    .catch((error) => {
                        this.setState({ jqlError: JSON.stringify(error.response.data.errorMessages) });
                    });
            }, 500);
        } else {
            this.setState({ jqlError: null });
        }
    };

    validateInput = (event) => {
        if (this.jqlTimer) {
            clearTimeout(this.jqlTimer);
        }
        const jql = event.currentTarget.value;
        this.validateRequest(jql);
    };

    validateWhenComponentDidMount = (value) => {
        this.validateRequest(value);
    };

}

JQLAutocomplete.propTypes = {
    getSuggestionsRequest: PropTypes.func.isRequired,
    getAutocompleteDataRequest: PropTypes.func.isRequired,
    /** Set the max height of the dropdown list in pixels. */
    maxHeight: PropTypes.number,
    initialValue: PropTypes.string,
    inputId: PropTypes.string.isRequired,
    inputValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    shouldFlip: PropTypes.bool,
    validationRequest: PropTypes.func.isRequired,
};

JQLAutocomplete.defaultProps = {
    maxHeight: 400,
    shouldFlip: false,
    initialValue: '',
    inputValue: '',
    label: ''
};

export default JQLAutocompleteInput;
