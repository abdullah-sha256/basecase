import { ProblemsContainer } from "./ProblemsContainer";
import { AttemptModal } from "./AttemptModal";

export const HomeRoute = () => {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold text-term-400">// all problems</p>
        <h1 className="mt-2 mb-8 text-2xl font-bold tracking-tight text-base-100">
          Grind smarter, not longer.
        </h1>
        <ProblemsContainer />
      </section>
      <AttemptModal />
    </>
  );
};
