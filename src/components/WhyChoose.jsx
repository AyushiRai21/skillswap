export default function WhyChoose() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Why choose <span className="text-teal-600">SkillSwap?</span>
        </h2>

        <p className="text-gray-600 mb-14">
          We've built a platform that makes exchanging skills simple, fair, and fun.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-3xl mb-4">📘</div>
            <h3 className="text-xl font-semibold mb-2">Learn Anything</h3>
            <p className="text-gray-600">
              From coding to cooking, find an expert willing to teach you their craft.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Teach Your Passion</h3>
            <p className="text-gray-600">
              Share what you know and get help with what you don't. It's a fair trade.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-600">
              Verified profiles and reviews ensure a safe learning environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
