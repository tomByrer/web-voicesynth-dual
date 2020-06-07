var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value')

const $local = document.getElementById('local')
const $log = document.getElementById('log')

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });


  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';

  let words = ""
  for( i=0; i<voices.length; i++ ){
    /* unforneally, named RegEx capture groups aren't in Firefox Stable yet */    
    words = voices[i].name.split(' ')
    voices[i].vendor = words[0]
    voices[i].surname = words[1]
    voices[i].natural = words[3] === '(Natural)' //MicroSoft
    logit( voices[i].surname +' '+ voices[i].vendor +'\tnatural:'+ voices[i].natural +' local:'+ voices[i].localService )
    // voiceList += voices[i].surname +' '+ voices[1].vendor +'\n'
    
    if ( !( $local.checked && !voices[i].localService ) ){
      let option = document.createElement('option')
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')'
      if(voices[i].default) {
        option.textContent += ' = DEFAULT'
      }
      option.setAttribute('data-lang', voices[i].lang)
      option.setAttribute('data-name', voices[i].name)
      voiceSelect.appendChild(option)
    }
  }
  voiceSelect.selectedIndex = selectedIndex
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        logit('Err: speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        logit('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        logit('Err: SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  speak();
}


function logit( t ){
	console.log(t)
	$log.value += `\n`+ t
	$log.scrollTop = $log.scrollHeight
}
function copyLog(){
  /* Select the text field */
  $log.select()
  $log.setSelectionRange(0, 99999) /*For mobile devices*/
  document.execCommand("copy")
  alert("Copied the text: " + $log.value);
}
