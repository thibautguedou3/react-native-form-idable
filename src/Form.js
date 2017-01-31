// @flow

import React, { Component } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { isArray } from 'lodash';
import Toast from '@remobile/react-native-toast';

type _Props = {
  children: any,
  submitText: string,
  onSubmit: () => void,
  scrollable: boolean,
  showErrorsInToast: boolean,
  isLoading: boolean,
  fieldStyle: any,
}

const styles = StyleSheet.create({
  scrollView: {
    alignSelf: 'stretch',
  },
});

class Form extends Component {
  inputs: Array<Object>;
  state: Object;
  static defaultProps = {
    submitText: 'validate',
    onSubmit: () => {},
  };

  constructor(props: _Props) {
    super(props);
    this.inputs = isArray(this.props.children) ? this.props.children : [this.props.children];
    this.state = this.inputs.reduce((formState, input) => ({
      ...formState,
      [input.props.name]: input.props.defaultValue,
    }), {});
  }

  onSubmit() {
    const errorMessages = [];
    this.inputs.forEach((child) => {
      if (!child.props.name) return;
      const inputErrorMessage = this.refs[child.props.name].getValidationError();
      if (inputErrorMessage) {
        errorMessages.push({
          inputPlaceholder: child.props.placeholder,
          message: inputErrorMessage,
        });
      }
    });
    if (errorMessages.length === 0) return this.props.onSubmit(this.state);

    if (this.props.showErrorsInToast) {
      Toast.showLongTop(`${errorMessages[0].inputPlaceholder}: ${errorMessages[0].message}`);
    }
  }

  renderTextInputClone(input: any) {
    return React.cloneElement(input, {
      ref: input.props.name,
      showError: !this.props.showErrorsInToast,
      fieldStyle: this.props.fieldStyle,
      onChangeValue: (value) => {
        this.setState({
          ...this.state,
          [input.props.name]: value,
        });
      },
    });
  }

  renderButtonClone(button: any) {
    return React.cloneElement(button, {
      onPress: () => this.onSubmit(),
    });
  }

  renderForm() {
    return (
      <ScrollView ref="scrollView" scrollEnabled={false} keyboardShouldPersistTaps="always">
        {this.inputs.map((child, index) => {
          return (
            <View key={index}>
              { child.type.name === 'Button' ? this.renderButtonClone(child) : this.renderTextInputClone(child)}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.scrollView}>
        { this.renderForm() }
      </View>
    );
  }
}

export default Form;