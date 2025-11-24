import React from 'react';
import renderer from 'react-test-renderer';
import PromiseVerificationCard from '../src/components/PromiseVerificationCard';

test('PromiseVerificationCard renders correctly with a simple promise', () => {
  const promise = {
    id: 'p1',
    title: 'Reduce inflation to single digits',
    description: 'Bring inflation below 10%',
  };

  const tree = renderer.create(<PromiseVerificationCard promise={promise} />).toJSON();
  expect(tree).toBeTruthy();
});
