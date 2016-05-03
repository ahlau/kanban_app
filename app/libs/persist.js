import makeFinalStore from 'alt-utils/lib/makeFinalStore';

// Expects storage to have get() and set() methods
// exports a function to be called to initialize storage and bootstrap storage
// Listens to finalStore to save data if any stores change.
export default function(alt, storage, storeName) {
  // setup a final store, listening to our alt instance
  const finalStore = makeFinalStore(alt);

  try {
    // given our alt instance, load up data from storage
    alt.bootstrap(storage.get(storeName));
  } catch(e) {
    console.error('Failed to bootstrap data', e);
  }

  finalStore.listen(() => {
    if(!storage.get('debug')) {
      // using the data from alt, save the data to our storage
      storage.set(storeName, alt.takeSnapshot());
    }
  });

}