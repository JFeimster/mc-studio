import wixWindowFrontend from 'wix-window-frontend';

function normalizeImage(imageValue) {
  if (!imageValue) {
    return '';
  }

  if (typeof imageValue === 'string') {
    if (imageValue.startsWith('wix:image://v1/')) {
      const stripped = imageValue.replace('wix:image://v1/', '');
      const mediaId = stripped.split('/')[0];
      return `https://static.wixstatic.com/media/${mediaId}`;
    }

    return imageValue;
  }

  if (typeof imageValue === 'object' && imageValue.src) {
    return imageValue.src;
  }

  return '';
}

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (error) {
        // Fall through to the delimiter-based parsing below.
      }
    }

    return trimmed
      .split(/\n|,/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeResourceList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return {
            title: item.title || item.label || 'Resource',
            url: item.url || item.embedUrl || '',
            description: item.description || '',
            buttonText: item.buttonText || 'Open Resource',
          };
        }

        if (typeof item === 'string') {
          const parts = item
            .split('|')
            .map((part) => part.trim())
            .filter(Boolean);

          if (parts.length >= 2) {
            return {
              title: parts[0],
              url: parts[1],
              description: '',
              buttonText: 'Open Resource',
            };
          }

          return {
            title: item,
            url: '',
            description: '',
            buttonText: 'Open Resource',
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  return [];
}

function getPreviewFallbackBroker() {
  return {
    fullName: 'Darwin Hanneman',
    partnerTagline:
      'Equipment finance guidance for business owners who need a practical next move, not more noise.',
    heroHeadline:
      'Equipment financing guidance with a more practical read on what may fit.',
    heroSubheadline:
      'Darwin Hanneman helps business owners explore equipment financing and related funding options with a clearer understanding of what may work, what may not, and what to do next.',
    agencyName: 'Moonshine Capital',
    shortBio:
      'Darwin Hanneman is a Moonshine Capital funding partner with a practical, relationship-driven approach to helping business owners explore equipment financing and related funding paths. His page is built to give prospects a cleaner starting point, useful tools, and a direct route to take action.',
    whyChooseYou:
      'Darwin is focused on helping business owners make a more informed decision when equipment, vehicles, or business-critical assets are on the line. Instead of pitching funding like a magic trick, the goal is to help prospects understand which lane may fit best, where they may have stronger approval odds, and what next step is actually worth taking.',
    fundingSpecialties: [
      'Equipment Financing',
      'Vehicle & Fleet Financing',
      'Revenue-Based Funding',
      'Business Term Loans',
      'SBA Options',
    ],
    targetAudience: [
      'Business Owners Needing Equipment',
      'Contractors',
      'Owner-Operators',
      'Service Businesses',
      'Real Estate Investors',
    ],
    curatedResourcesResolved: [
      {
        title: 'The Trucker Repair-to-Revenue Tracker',
        url: 'https://trucker-repair-tracker.vercel.app/',
        description:
          'Estimate how repair downtime affects revenue and cash-flow recovery for trucking and equipment-heavy operators.',
        buttonText: 'Open Resource',
      },
      {
        title: 'Funding Estimator',
        url: 'https://estimator-lyart.vercel.app/',
        description:
          'Model possible funding amounts and set better expectations before applying.',
        buttonText: 'Open Resource',
      },
      {
        title: 'Staged Funding',
        url: 'https://staged-funding.vercel.app/',
        description:
          'Explore smarter capital sequencing instead of taking one blunt funding hit.',
        buttonText: 'Open Resource',
      },
      {
        title: 'Funding for Any Reason',
        url: 'https://funding-any-reason.vercel.app/',
        description:
          'A broader funding option for applicants whose use case does not fit neatly into one box.',
        buttonText: 'Open Resource',
      },
      {
        title: 'Financing Widget',
        url: 'https://financing-widget-gamma.vercel.app/',
        description:
          'A lightweight financing widget for quick qualification and conversion support.',
        buttonText: 'Open Resource',
      },
    ],
    applicationUrl: 'https://bit.ly/fundingwithdarwin',
    calendarUrl: 'https://distilledfunding.com/book-online',
  };
}

$w.onReady(function () {
  const frame = $w('#partnerFrame');
  const broker = wixWindowFrontend.getRouterData() || getPreviewFallbackBroker();

  const curatedResources = normalizeResourceList(
    broker.curatedResourcesResolved
  );
  const fallbackResources = normalizeResourceList(broker.featuredResources);

  const payload = {
    fullName: broker.fullName || 'Moonshine Capital Broker',
    profileImage: normalizeImage(broker.profileImage),
    partnerTagline: broker.partnerTagline || '',
    heroHeadline:
      broker.heroHeadline ||
      'Business funding help without the usual circus.',
    heroSubheadline:
      broker.heroSubheadline ||
      'Get clarity on what may fit, what probably will not, and what the smartest next step looks like.',
    agencyName: broker.agencyName || 'Moonshine Capital',
    city: broker.city || '',
    state: broker.state || '',
    publicEmail: broker.publicEmail || '',
    directPhone: broker.directPhone || '',
    websiteUrl: broker.websiteUrl || '',
    shortBio: broker.shortBio || '',
    whyChooseYou: broker.whyChooseYou || '',
    targetAudience: normalizeList(broker.targetAudience),
    fundingSpecialties: normalizeList(broker.fundingSpecialties),
    featuredResources: curatedResources.length
      ? curatedResources
      : fallbackResources,
    applicationUrl: broker.applicationUrl || broker.primaryCtaLink || '',
    calendarUrl: broker.calendarUrl || '',
  };

  frame.postMessage({
    type: 'partnerData',
    payload,
  });

  frame.onMessage((event) => {
    const data = event.data || {};

    if (data.type === 'resize' && data.height) {
      frame.height = Math.max(1200, Number(data.height));
    }

    if (data.type === 'openLink' && data.url) {
      wixWindowFrontend.openLightbox ? null : null;
      window.location.href = data.url;
    }
  });
});
