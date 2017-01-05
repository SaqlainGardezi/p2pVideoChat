
	// ps-webrtc-peerjs.js
	// Author: Saqlain Hussain Shah (http://www.github.com/SaqlainGardezi)
	// -
	// Two Person chat with manual signalling

navigator.getWebcam=(navigator.getUserMedia		||
					navigator.mozGetUserMedia	||
					navigator.webkitGetUserMedia||
					navigator.msGetUserMedia);

//PeerJS object for production get key at peerjs.com/peerserver
var peer = new Peer({key: '961kfkgp8uuwhfr',
					debug:3,
					config: {
						'iceServers':[
						{ url: 'stun:stun.l.google.com:19302'},
						{ url: 'stun:stun1.l.google.com:19302'},
						{ url: 'turn:numb.viagenie.ca', username: "saqlaingardezi86@gmail.com", credentials: "mubarak123 "}
						]
					}
				});

// On open, set the peer id
peer.on('open', function(){
 $('#my-id').text(peer.id);
});

peer.on('call', function(call){
	// Answer automatically for demo
	call.answer(window.localStream);
	step3(call);
});

//Click Handlers setup
$(function(){
	$('#make-call').click(function(){
		// Initiate a call!
		var call = peer.call($('#callto-id').val(), window.localStream);
		step3(call);
	});
	$('#end-call').click(function(){
		console.log(window);
//		window.existingCall.stop();
		console.log(MediaStream);
		console.log(window);
		step2();
	});

	// Retry if getUserMedia fails
	$('#step1-retry').click(function(){
		$('#step1-error').hide();
		step();
	});

	//Get things started
	step1();
});

function step1(){
	//Get audio/video stream
	navigator.getWebcam({
		audio: false,
		video: true
	},
	function(stream){
		//Display video stream in video object
		$('#my-video').prop('src', URL.createObjectURL(stream));

		window.localStream=stream;
		console.log("Helllo");
		step2();
	}, function(){ $('#step1-error').show(); });
}

function step2(){ //Adjust the UI
	$('#step1', '#step3').hide();
	$('#step2').show();
}

function step3(call){
	// Hang up on an existing call if present
	if (window.existingCall) {
		window.existingCall.close();
	}

	//Wait for streamon the call, then setup peer video
	call.on('stream', function(stream){
		$('#their-video').prop('src', URL.createObjectURL(stream));
	});
	$('#step1', '#step2').hide();
	$('#step3').show();
}