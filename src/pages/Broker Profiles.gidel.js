import wixLocation from 'wix-location';
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

$w.onReady(function () {
  const broker = wixWindowFrontend.getRouterData();
  const frame = $w('#partnerFrame');

  if (!broker) {
    wixLocation.to('/');
    return;
  }

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
      wixLocation.to(data.url);
    }
  });
});
