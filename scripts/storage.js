
async function getIgnoreMap() {
    let item = await browser.storage.sync.get(["ignored", "ignored_names"]);
    if(jQuery.isEmptyObject(item))
        item = {ignored: new Array(), ignored_names: new Array()};
    
    let c = item.ignored.map(function(e, i) {
        return [e, item.ignored_names[i]];
    });

    let ignored_map = new Map(c);
    return ignored_map;
}

async function storeIgnoreMap(ignored_map) {
    await browser.storage.sync.set({
        ignored: Array.from(ignored_map.keys()),
        ignored_names: Array.from(ignored_map.values()),
    });
}

async function unignoreCompany(id) {
    let ignored_map = await getIgnoreMap();
    ignored_map.delete(id);
    storeIgnoreMap(ignored_map);
}

async function ignoreCompany(id, name) {
    console.log(`Ignoring...${id}`);
    let ignored_map = await getIgnoreMap();
    ignored_map.set(id, name);
    storeIgnoreMap(ignored_map);
}
