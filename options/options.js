const list_el = $(`
    <li><span></span><a href="#">Unignore</a></li>
`);

async function populateList() {
    let ignored = await getIgnoreMap();
    let list_element = $(".ignored_companies");
    ignored.forEach(function(value, key, map) {
        let entry = list_el.clone();
        entry.find("span").text(value);
        entry.find("a").click(function(e) {
            e.preventDefault();
            unignoreCompany(key);
            $(this).parents("li").remove();
        });
        list_element.append(entry);
    });
}

populateList();