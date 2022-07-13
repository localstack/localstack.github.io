var suggestions = document.getElementById('suggestions');
var userinput = document.getElementById('userinput');

if (userinput != null) {

document.addEventListener('keydown', inputFocus);

function inputFocus(e) {

  if (e.keyCode === 191 ) {
    e.preventDefault();
    userinput.focus();
  }

  if (e.keyCode === 27 ) {
    userinput.blur();
    suggestions.classList.add('d-none');
  }

}
}

if (suggestions != null) {

  document.addEventListener('click', function(event) {

    var isClickInsideElement = suggestions.contains(event.target);

    if (!isClickInsideElement) {
      suggestions.classList.add('d-none');
    }

  });

  /*
  Source:
    - https://dev.to/shubhamprakash/trap-focus-using-javascript-6a3
  */

  document.addEventListener('keydown',suggestionFocus);

  function suggestionFocus(e){

    const focusableSuggestions= suggestions.querySelectorAll('a');
    const focusable= [...focusableSuggestions];
    const index = focusable.indexOf(document.activeElement);

    let nextIndex = 0;

    if (e.keyCode === 38) {
      e.preventDefault();
      nextIndex= index > 0 ? index-1 : 0;
      focusableSuggestions[nextIndex].focus();
    }
    else if (e.keyCode === 40) {
      e.preventDefault();
      nextIndex= index+1 < focusable.length ? index+1 : index;
      focusableSuggestions[nextIndex].focus();
    }

  }

  /*
  Source:
    - https://github.com/nextapps-de/flexsearch#index-documents-field-search
    - https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html
  */

  (function(){

    var index = new FlexSearch({
      preset: 'score',
      cache: true,
      doc: {
          id: 'id',
          field: [
            'title',
            'description',
            'content',
          ],
          store: [
            'href',
            'title',
            'description',
          ],
      },
    });

    var docs = [
      {{ range $index, $page := (where .Site.Pages "Section" "docs") -}}
        {
          id: {{ $index }},
          href: "{{ .RelPermalink | relURL }}",
          title: {{ .Title | jsonify }},
          description: {{ .Params.description | jsonify }},
          content: {{ .Content | jsonify }}
        },
      {{ end -}}
    ];

    index.add(docs);

    userinput.addEventListener('input', show_results, true);
    suggestions.addEventListener('click', accept_suggestion, true);

    function show_results(){

      var value = this.value;
      var results = index.search(value, 5);
      var entry, childs = suggestions.childNodes;
      var i = 0, len = results.length;

      suggestions.classList.remove('d-none');

      results.forEach(function(page) {

        entry = document.createElement('div');

        entry.innerHTML = '<a href><span></span><span></span></a>';

        a = entry.querySelector('a'),
        t = entry.querySelector('span:first-child'),
        d = entry.querySelector('span:nth-child(2)');

        a.href = page.href;
        t.textContent = page.title;
        d.textContent = page.description;

        suggestions.appendChild(entry);

      });

      while(childs.length > len){

          suggestions.removeChild(childs[i])
      }

    }

    function accept_suggestion(){

        while(suggestions.lastChild){

            suggestions.removeChild(suggestions.lastChild);
        }

        return false;
    }

  }());

}

const referenceChildren = document.getElementById('Reference-children')
if (referenceChildren != null) {

  const referenceCollapseBtn = document.getElementById('Reference-btn')
  referenceChildren.addEventListener('hide.bs.collapse', function () {
    const icon = referenceCollapseBtn.getElementsByTagName('i')[0]
    icon.classList.add('bi-chevron-compact-left')
    icon.classList.remove('bi-chevron-compact-down')
  })

  referenceChildren.addEventListener('show.bs.collapse', function () {
    const icon = referenceCollapseBtn.getElementsByTagName('i')[0]
    icon.classList.add('bi-chevron-compact-down')
    icon.classList.remove('bi-chevron-compact-left')
  })
}

function preSelectPlatformArtifact(artifacts) {
  const platform = navigator.platform;
  artifacts[0].checked = false;
  for (let i = 0; i < artifacts.length; i++) {
    const platformPattern = artifacts[i].getAttribute('data-platform');
    if (platform.match(platformPattern)) {
      artifacts[i].checked = true;
      return;
    }
  }
  artifacts[0].checked = true;
}

(function () {
  const cockpitDownloadModalEl = document.getElementById('cockpitDownloadModal');
  if (cockpitDownloadModalEl == null) return;
  const cockpitDownloadModal = bootstrap.Modal.getOrCreateInstance(cockpitDownloadModalEl);

  const cockpitDownloadThanksModalEl = document.getElementById('cockpitDownloadThanksModal');
  const cockpitDownloadThanksModal = bootstrap.Modal.getOrCreateInstance(cockpitDownloadThanksModalEl);

  const cockpitErrorModalEl = document.getElementById('cockpitErrorModal');
  const cockpitErrorModal = bootstrap.Modal.getOrCreateInstance(cockpitErrorModalEl);
  const showError = (title, message) => {
    cockpitErrorModalEl.querySelector('#cockpitErrorModalLabel').textContent = title;
    cockpitErrorModalEl.querySelector('#cockpitErrorModalMessage').textContent = message;
    cockpitErrorModal.show();
  };

  const cockpitDownloadFormEl = document.getElementById('cockpitDownloadForm');

  const artifacts = cockpitDownloadFormEl.querySelectorAll('[name="artifact"]');
  preSelectPlatformArtifact(artifacts);

  cockpitDownloadFormEl.onsubmit = function (event) {
    event.preventDefault();

    const artifactRadios = cockpitDownloadFormEl.querySelectorAll('[name="artifact"]');
    const selectedArtifactRadio = Array.from(artifactRadios).find(radio => radio.checked);

    const emailField = cockpitDownloadFormEl.querySelector('[name="email"]');
    const newsletterField = cockpitDownloadFormEl.querySelector('[name="newsletter"]');

    const requestBody = {
      artifact: selectedArtifactRadio.value,
      email: emailField.value,
      newsletter: newsletterField.checked ? "1" : "0"
    }

    fetch('{{ .Site.Params.localStackApiEndpoint -}}', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }).then(response => {
      return response.json().then(data => [response.status, data]);
    }).then(([status, data]) => {
      if (status === 200) {
        cockpitDownloadModal.hide();
        cockpitDownloadThanksModal.show();
      } else if (status === 400) {
        alert('Error occurred: ' + data.message);
      } else if (status === 404) {
        cockpitDownloadModal.hide();
        showError("Error: " + data.message, "This is probably a problem on our side, sorry! Please contact us and let us know at info@localstack.cloud");
      } else {
        cockpitDownloadModal.hide();
        showError("Unknown error occurred", "Please contact us and let us know. Thanks!");
      }
    });
  }
})();

// will hide all elements which tag-${tag} as className
// requires you to add the tag-${tag} to your elements
// can be done like this, assuming .tags is a string array, check out blog/list.html
// dont forget tag-all for resetting the filter
// also sets correct classes on the buttons for filtering based on id: ${tag}FilterButton
// requires you to add the filterButton class to your buttons, and ${tag}FilterButton as the id for these buttons
function toggleTag(tag) {
  const fullTag = 'tag-' + tag

  if (fullTag !== 'tag-all') {
    const hideElems = document.getElementsByClassName('tag-all')
    for (let index = 0; index < hideElems.length; index++) {
      const element = hideElems[index];
      element.classList.add('d-none')
    }
  }

  const showElems = document.getElementsByClassName(fullTag)
  for (let index = 0; index < showElems.length; index++) {
    const element = showElems[index];
    element.classList.remove('d-none')
  }


  //also set which filter button is active
  const filterButtons = document.getElementsByClassName('filterButton')
    for (let index = 0; index < filterButtons.length; index++) {
      const filterButton = filterButtons[index];
      filterButton.classList.remove('bg-purple')
      filterButton.classList.remove('btn-primary')
      filterButton.classList.add('btn-outline-primary')
    }

    const buttonTag = tag + "FilterButton"
    const activeButton = document.getElementById(buttonTag)
    activeButton.classList.add('bg-purple')
    activeButton.classList.add('btn-primary')
    activeButton.classList.remove('btn-outline-primary')
}
