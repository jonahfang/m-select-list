const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;
const $ = require('jquery');
const MSelectList = require('../index.js');
import '../examples/demo.less';
import { province } from '../examples/data';

describe('simple', () => {
  let instance;
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <MSelectList className="wrapper"
        data={province}
      />,
    div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('wrapper') !== -1).to.be(true);
  });

  it('should filter specific item', () => {
    instance = ReactDOM.render(
      <MSelectList
        data={province}
        defaultInputValue="bj"
        showInput
        showQuickSearchBar={false}
        showCurrentSelected={false}
      />,
    div);
    expect($(instance.refs.searchView).text()).to.be('北京市');
  });

  it('should fire onInputChange event', (done) => {
    function cb(value) {
      // todo: 避免用 setTimeout。 react setState并更新dom后，是否有相应事件抛出？
      setTimeout(() => {
        expect(value).to.be('400');
        expect($(instance.refs.searchView).find('li').length).to.be(0);
        done();
      }, 0);
    }
    instance = ReactDOM.render(
      <MSelectList
        data={province}
        showInput
        onInputChange={cb}
      />,
    div);
    instance.refs.sinput.value = '400';
    Simulate.change(instance.refs.sinput);
  });

  it('should fire onChange event', (done) => {
    function cb(value) {
      // console.log(value);
      expect(value.spell).to.be('AnHuiSheng');
      done();
    }
    instance = ReactDOM.render(
      <MSelectList
        data={province}
        onChange={cb}
      />,
    div);
    // 'touchend' or 'mouseup' 时触发 onChange。但它们在 'touchstart' or 'mousedown' 事件里注册。
    // 所以先触发 mouseDown，一段时间后，再触发 mouseUp。
    // 但是仍不对！ todo...
    setTimeout(() => {
      Simulate.mouseDown($(instance.refs.normalView).find('[data-spell="AnHuiSheng"]')[0]);
      setTimeout(() => {
        Simulate.mouseUp($(instance.refs.normalView).find('[data-spell="AnHuiSheng"]')[0]);
        // temporary. need to remove
        done();
      }, 10);
    }, 0);
  });
});
