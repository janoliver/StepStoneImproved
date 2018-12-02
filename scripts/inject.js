const replace_indicator = $(`
    <div class="job-element-row replacer">
        <div style="padding:5px; background:#FFC0CB;font-size:0.8em">
            Hidden posting from <span class="company-name"></span> -
            <a href="#" style="color:#000" class="show-posting">Toggle</a> - 
            <a href="#" style="color:#000" class="unignore">Unignore</a> 
        </div>
    </div>
`);

const ignore_link = $(`
    <span class="iconic iconic-x-thin ignore-company iconic-sm mr--xxs" title="delete" aria-hidden="true"></span>
`);

function getIgnoredReplacer(id, name) {
    let replacer = replace_indicator.clone();
    replacer.find(".company-name").text(name);
    replacer.attr("ssi-ignored", `${id}`);
    replacer.find(".show-posting").click(function(e) {
        e.preventDefault();
        $(this).parents(".job-element-row").next().toggle();
    });
    replacer.find(".unignore").click(function(e) {
        e.preventDefault();
        unignoreCompany(id);
        $(`.replacer[ssi-ignored=${id}]`).hide();
        $(`.job-element-row:not(.replacer)[ssi-ignored=${id}]`).show();
    });
    return replacer;
}


async function hideIgnored() {
    let item = await browser.storage.sync.get(["ignored", "ignored_names"]);
    $(".job-element-row").each(function(e) {
        let row = $(this);
        const company_info = getCompanyID(row);
        if(item.ignored.includes(company_info[0])) {
            row.attr("ssi-ignored", `${company_info[0]}`).toggle();
            let replacer = getIgnoredReplacer(company_info[0], company_info[1]);
            row.before(replacer);
        }
    });
}

function addIgnoreLink() {
    $(".save-listing-element").each(function() {
        $(this).before(function() {
            return ignore_link.clone().click(function(e) {
                e.preventDefault();
                let row = $(this).parents(".job-element-row");
                const company_info = getCompanyID(row);
                ignoreCompany(company_info[0], company_info[1]);
                let replacer = getIgnoredReplacer(company_info[0], company_info[1]);
                row.attr("ssi-ignored", `${company_info[0]}`).toggle();
                row.before(replacer);
            });
        });
    });
}

function getCompanyID(el) {
    const cid_re = /\/cmp\/de\/.+?-(\d+)\/jobs\.html/g;
    const href = el.find(".js-company-logo-click-trigger").attr("href");
    const name = el.find(".job-element__body__company").text();
    const id = parseInt(cid_re.exec(href)[1])
    return [id, name];
}
let blocked = false;

$(document).on("DOMNodeInserted", ".job-elements-list", function() {
    
    if(!blocked) {
        blocked = true;
        hideIgnored();
        addIgnoreLink();
        setTimeout(function () {
            blocked = false;
        }, 1000);
    }
});

hideIgnored();
addIgnoreLink();