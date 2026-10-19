(() => {
  const { gsap, ScrollTrigger } = window;
  // Content and controls remain usable if the animation library cannot load.
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', (context) => {
    const intro = gsap.timeline({ defaults: { duration: 0.75, ease: 'power3.out' } });
    intro
      .from('.hero h1 > span', { y: 35, autoAlpha: 0, stagger: 0.08, clearProps: 'all' }, 0)
      .from('.hero-copy, .hero-actions, .hero-note', { y: 16, autoAlpha: 0, stagger: 0.08, clearProps: 'all' }, 0.25)
      .from('.back-sheet', { rotation: 0, x: 0, y: 25, autoAlpha: 0, stagger: 0.12, clearProps: 'all' }, 0.2)
      .from('#artifact-brief', { y: 35, rotation: -4, autoAlpha: 0, clearProps: 'all' }, 0.4)
      .from('.scene-caption', { x: -15, autoAlpha: 0, clearProps: 'all' }, 0.7);

    gsap.from('.journey-index', {
      scale: 0.8, duration: 0.5, ease: 'power2.out', stagger: 0.15,
      scrollTrigger: { trigger: '.journey', start: 'top 82%', once: true },
      clearProps: 'all',
    });
    const delegation = gsap.timeline({
      defaults: { duration: 0.55, ease: 'power2.out' },
      scrollTrigger: { trigger: '.delegation-visual', start: 'top 75%', once: true },
    });
    delegation
      .from('.delegation-lines i', { scaleY: 0, stagger: 0.08, clearProps: 'all' })
      .from('.agent-jobs > div', { y: -14, autoAlpha: 0, stagger: 0.1, clearProps: 'all' }, '-=0.25');

    context.add('changeArtifact', (event) => {
      // A quick tab change cancels the previous entrance rather than stacking tweens.
      gsap.killTweensOf('.artifact');
      gsap.set('.artifact', { clearProps: 'all' });
      gsap.fromTo(event.detail, { y: 14, rotation: -2, autoAlpha: 0 }, {
        y: 0, rotation: 0, autoAlpha: 1, duration: 0.4,
        ease: 'power2.out', clearProps: 'all',
      });
    });
    document.addEventListener('studio:artifact', context.changeArtifact);
    return () => document.removeEventListener('studio:artifact', context.changeArtifact);
  });

  media.add('(min-width: 851px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo('.journey-progress span', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.journey', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
    });
    gsap.to('.scene-path', {
      x: 25, y: 45, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  document.addEventListener('studio:layout', refresh);
  document.querySelectorAll('.faq-list details').forEach((item) => item.addEventListener('toggle', refresh));
  window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
})();
