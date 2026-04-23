import wixData from 'wix-data';
import { ok, notFound, redirect } from 'wix-router';

async function getCuratedResources(brokerId) {
  try {
    const referenced = await wixData.queryReferenced(
      'brokerProfiles',
      brokerId,
      'curatedResources',
      {
        suppressAuth: true,
        suppressHooks: true,
      }
    );

    return (referenced.items || []).map((item) => ({
      title: item.title || 'Resource',
      url: item.url || item.embedUrl || '',
      description: item.description || '',
      buttonText: item.buttonText || 'Open Resource',
      resourceType: item.resourceType || '',
      slug: item.slug || '',
    }));
  } catch (error) {
    console.warn('Unable to resolve curatedResources for broker profile.', error);
    return [];
  }
}

function isBrokerVisible(broker) {
  const isActive = broker?.isActive !== false;
  const approvalStatus = String(broker?.approvalStatus || '').toLowerCase();

  if (!isActive) {
    return false;
  }

  if (['draft', 'inactive', 'archived'].includes(approvalStatus)) {
    return false;
  }

  return true;
}

export async function broker_Router(request) {
  try {
    const slug = String(request?.path?.[0] || '')
      .trim()
      .toLowerCase();

    if (!slug) {
      return redirect('/');
    }

    const result = await wixData
      .query('brokerProfiles')
      .eq('slug', slug)
      .limit(1)
      .find({
        suppressAuth: true,
        suppressHooks: true,
      });

    if (!result.items.length) {
      return notFound();
    }

    const broker = result.items[0];

    if (!isBrokerVisible(broker)) {
      return notFound();
    }

    const curatedResourcesResolved = broker?._id
      ? await getCuratedResources(broker._id)
      : [];

    return ok('Broker Profiles', {
      ...broker,
      curatedResourcesResolved,
    });
  } catch (error) {
    console.error('broker_Router error', error);
    return notFound();
  }
}
