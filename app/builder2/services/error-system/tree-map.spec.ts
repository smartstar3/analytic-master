import { ErrorState, FlatErrorState, Node } from './tree-map';
import { filter, skip, take } from 'rxjs/operators';

const obj1 = {
  child1: {
    subchild1: '',
    subchild2: {
      subsubchild: 1,
    },
  },
  child2: false,
  child3: [0, 1, 2],
};
let root: Node<ErrorState>;
describe('Node', () => {
  afterEach(() => root.delete());
  it('should create from object', () => {
    root = Node.from(obj1);
    expect(root.children.child1).toBeTruthy();
    expect(root.children.child2).toBeTruthy();
    expect(root.children.child3).toBeTruthy();
    expect(Object.keys(root.children.child3?.children).length).toBe(0);
    expect(root.children.child1?.children.subchild1).toBeTruthy();
    expect(root.children.child1?.children.subchild2).toBeTruthy();
    expect(root.children.child1?.children.subchild2?.children.subsubchild).toBeTruthy();
  });
  it('should create root from empty obj', () => {
    root = Node.from({});
    expect(root).toBeTruthy();
    expect(Object.keys(root.children).length).toBe(0);
  });
});

describe('TreeMap', () => {
  beforeEach(() => (root = Node.from(obj1)));
  afterEach(() => root.delete());
  it('should get the root when asking for empty string', () => {
    const node = root.get('');
    expect(node).toBeTruthy();
    expect(node.key).toBeUndefined();
  });
  it(`should get child node when asking for it's path`, () => {
    const node = root.get('child1');
    expect(node).toBeTruthy();
    expect(node.key).toBe('child1');
  });
  it(`should get sub child node when asking for it's path`, () => {
    const node = root.get('child1.subchild2.subsubchild');
    expect(node).toBeTruthy();
    expect(node.key).toBe('subsubchild');
  });
  it('should create node(s) when setting to a non/partially existent path', () => {
    expect(root.get('child1.newsubchild.newsubsubchild')).toBeNull();
    root.set('child1.newsubchild.newsubsubchild', { error: '', warning: '' }, true);
    expect(root.get('child1.newsubchild.newsubsubchild')).toBeTruthy();
  });
  it('should return null when asking for nonexistent path', () => {
    const node = root.get('subchild1');
    expect(node).toBeNull();
  });
  it('should trigger valueChange when the value changes', (done: DoneFn) => {
    root.valueChange
      .pipe(
        filter((state: ErrorState) => !!state),
        take(1)
      )
      .subscribe((state: ErrorState) => {
        expect(state.error).toBe('A');
        expect(state.warning).toBe('B');
        done();
      });
    root.value = { error: 'A', warning: 'B' };
  });
  it('should trigger flatChange when own value changes', (done: DoneFn) => {
    const p = root.flatChange
      .pipe(
        filter((state: FlatErrorState) => !!state),
        skip(1),
        take(1)
      )
      .subscribe((state: FlatErrorState) => {
        expect(state.error).toContain('A');
        expect(state.warning).toContain('B');
        done();
      });
    root.show = true;
    root.value = { error: 'A', warning: 'B' };
    return p;
  });
  it('should trigger flatChange when child value changes', (done: DoneFn) => {
    root.flatChange
      .pipe(
        filter((state: FlatErrorState) => !!state),
        skip(3), // ignore the first change and only check after the last change is done
        take(1)
      )
      .subscribe((state: FlatErrorState) => {
        expect(state.error).toContain('child1');
        expect(state.error).toContain('subchild1');
        expect(state.warning).toContain('child1');
        done();
      });
    root.get('child1').show = true;
    root.get('child1').value = { error: 'child1', warning: 'child1' };
    root.get('child1.subchild1').show = true;
    root.get('child1.subchild1').value = { error: 'subchild1' };
  });
  it('should NOT trigger flatChange when deleted child value changes', (done: DoneFn) => {
    root.flatChange
      .pipe(
        filter((state: FlatErrorState) => !!state),
        skip(4),
        take(1)
      )
      .subscribe((state: FlatErrorState) => {
        expect(state.error).not.toContain('child1');
        expect(state.error).toContain('child2');
        done();
      });
    root.get('child1').show = true;
    root.get('child2').show = true;
    const child1 = root.set('child1', { error: 'child1' });
    root.set('child2', { error: 'child2' });
    root.get('child1').delete();
    expect(root.get('child1')).toBeNull();
    child1.value = { error: 'child1' };
  });
});
