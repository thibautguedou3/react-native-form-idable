import React from 'react';
import { mount } from 'enzyme';
import { Text, TouchableOpacity } from 'react-native';

import Form from './Form';
import TextInput from './TextInput';

console.error = jest.fn();

const jsdom = require('jsdom').jsdom;

const setupContainerTesting = () => {
  global.document = jsdom('');
  global.window = document.defaultView;
};
setupContainerTesting();

jest.mock('@bam.tech/react-native-root-toast', () => ({}));

describe('<Form />', () => {
  it('submits the form', () => {
    const onSubmit = jest.fn();
    const form = mount(
      <Form onSubmit={onSubmit}>
        <TextInput name="email" type="email" defaultValue="alexandrem@bam.tech" />
        <TextInput name="password" type="password" defaultValue="Very secure password" />
        <TouchableOpacity type="submit">
          <Text>Submit</Text>
        </TouchableOpacity>
      </Form>,
    );

    form.instance().onSubmit();

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'alexandrem@bam.tech',
      password: 'Very secure password',
    });
  });

  it('returns default error message if no message is specified', () => {
    const onValidationError = jest.fn();
    const form = mount(
      <Form onValidationError={onValidationError}>
        <TextInput name="email" placeholder="Email" type="email" defaultValue="alexandrem" />
        <TouchableOpacity type="submit" />
      </Form>,
    );
    form.instance().onSubmit();
  });
});
