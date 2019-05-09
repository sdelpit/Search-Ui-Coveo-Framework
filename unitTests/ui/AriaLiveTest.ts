import { AriaLive } from '../../src/ui/AriaLive/AriaLive';
import { $$ } from '../../src/Core';
import { Simulate } from '../Simulate';
import { MockEnvironmentBuilder, IMockEnvironment } from '../MockEnvironment';
import { FakeResults } from '../Fake';

export const AriaLiveTest = () => {
  describe('AriaLive', () => {
    let ariaLive: AriaLive;
    let env: IMockEnvironment;

    beforeEach(() => {
      env = new MockEnvironmentBuilder().build();
      ariaLive = new AriaLive(env.root);
    });

    function ariaLiveEl() {
      return $$(env.root).find('[aria-live]');
    }

    it(`adds a div with attribute aria-live as a child`, () => {
      expect(ariaLiveEl().getAttribute('aria-live')).toBe('polite');
    });

    it(`when calling #updateText with a value,
    it sets the ariaLive element text to the value`, () => {
      const text = 'text';
      ariaLive.updateText(text);

      expect(ariaLiveEl().textContent).toBe(text);
    });

    it(`when triggering a successful query with results,
    it updates the text with the number of results`, () => {
      Simulate.query(env);
      expect(ariaLiveEl().textContent).toMatch(/^Results/);
    });

    describe(`when triggering a successful query with unsafe characters and no results`, () => {
      const dangerousChar = '<';

      beforeEach(() => {
        const options = {
          query: { q: dangerousChar },
          results: FakeResults.createFakeResults(0)
        };
        Simulate.query(env, options);
      });

      it('updates the text to a no results message', () => expect(ariaLiveEl().textContent).toMatch(/^No results/));

      it('the message contains a sanitized form of the query', () => {
        const message = ariaLiveEl().textContent;
        expect(message).not.toContain(dangerousChar);
      });
    });

    it('when triggering a query that errors, it updates the text to an error message', () => {
      Simulate.queryError(env);
      const message = ariaLiveEl().textContent;

      expect(message).toContain('error');
    });
  });
};
