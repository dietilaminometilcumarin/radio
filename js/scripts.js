!function(t){"use strict";"undefined"!=typeof wpcf7&&null!==wpcf7&&(wpcf7=t.extend({cached:0,inputs:[]},wpcf7),t((function(){wpcf7.supportHtml5=function(){var e={},a=document.createElement("input");e.placeholder="placeholder"in a;return t.each(["email","url","tel","number","range","date"],(function(t,n){a.setAttribute("type",n),e[n]="text"!==a.type})),e}(),t("div.wpcf7 > form").each((function(){var e=t(this);wpcf7.initForm(e),wpcf7.cached&&wpcf7.refill(e)}))})),wpcf7.getId=function(e){return parseInt(t('input[name="_wpcf7"]',e).val(),10)},wpcf7.initForm=function(e){var a=t(e);wpcf7.setStatus(a,"init"),a.submit((function(e){wpcf7.supportHtml5.placeholder||t("[placeholder].placeheld",a).each((function(e,a){t(a).val("").removeClass("placeheld")})),"function"==typeof window.FormData&&(wpcf7.submit(a),e.preventDefault())})),t(".wpcf7-submit",a).after('<span class="ajax-loader"></span>'),wpcf7.toggleSubmit(a),a.on("click",".wpcf7-acceptance",(function(){wpcf7.toggleSubmit(a)})),t(".wpcf7-exclusive-checkbox",a).on("click","input:checkbox",(function(){var e=t(this).attr("name");a.find('input:checkbox[name="'+e+'"]').not(this).prop("checked",!1)})),t(".wpcf7-list-item.has-free-text",a).each((function(){var e=t(":input.wpcf7-free-text",this),a=t(this).closest(".wpcf7-form-control");t(":checkbox, :radio",this).is(":checked")?e.prop("disabled",!1):e.prop("disabled",!0),a.on("change",":checkbox, :radio",(function(){t(".has-free-text",a).find(":checkbox, :radio").is(":checked")?e.prop("disabled",!1).focus():e.prop("disabled",!0)}))})),wpcf7.supportHtml5.placeholder||t("[placeholder]",a).each((function(){t(this).val(t(this).attr("placeholder")),t(this).addClass("placeheld"),t(this).focus((function(){t(this).hasClass("placeheld")&&t(this).val("").removeClass("placeheld")})),t(this).blur((function(){""===t(this).val()&&(t(this).val(t(this).attr("placeholder")),t(this).addClass("placeheld"))}))})),wpcf7.jqueryUi&&!wpcf7.supportHtml5.date&&a.find('input.wpcf7-date[type="date"]').each((function(){t(this).datepicker({dateFormat:"yy-mm-dd",minDate:new Date(t(this).attr("min")),maxDate:new Date(t(this).attr("max"))})})),wpcf7.jqueryUi&&!wpcf7.supportHtml5.number&&a.find('input.wpcf7-number[type="number"]').each((function(){t(this).spinner({min:t(this).attr("min"),max:t(this).attr("max"),step:t(this).attr("step")})})),wpcf7.resetCounter(a),a.on("change",".wpcf7-validates-as-url",(function(){var e=t.trim(t(this).val());e&&!e.match(/^[a-z][a-z0-9.+-]*:/i)&&-1!==e.indexOf(".")&&(e="http://"+(e=e.replace(/^\/+/,""))),t(this).val(e)}))},wpcf7.submit=function(e){if("function"==typeof window.FormData){var a=t(e);t(".ajax-loader",a).addClass("is-active"),wpcf7.clearResponse(a);var n=new FormData(a.get(0)),i={id:a.closest("div.wpcf7").attr("id"),status:"init",inputs:[],formData:n};t.each(a.serializeArray(),(function(t,e){"_wpcf7"==e.name?i.contactFormId=e.value:"_wpcf7_version"==e.name?i.pluginVersion=e.value:"_wpcf7_locale"==e.name?i.contactFormLocale=e.value:"_wpcf7_unit_tag"==e.name?i.unitTag=e.value:"_wpcf7_container_post"==e.name?i.containerPostId=e.value:e.name.match(/^_/)||i.inputs.push(e)})),wpcf7.triggerEvent(a.closest("div.wpcf7"),"beforesubmit",i);t.ajax({type:"POST",url:wpcf7.apiSettings.getRoute("/contact-forms/"+wpcf7.getId(a)+"/feedback"),data:n,dataType:"json",processData:!1,contentType:!1}).done((function(e,n,c){!function(e,a,n,c){switch(i.id=t(e.into).attr("id"),i.status=e.status,i.apiResponse=e,e.status){case"init":wpcf7.setStatus(c,"init");break;case"validation_failed":t.each(e.invalid_fields,(function(e,a){t(a.into,c).each((function(){wpcf7.notValidTip(this,a.message),t(".wpcf7-form-control",this).addClass("wpcf7-not-valid"),t("[aria-invalid]",this).attr("aria-invalid","true")}))})),wpcf7.setStatus(c,"invalid"),wpcf7.triggerEvent(e.into,"invalid",i);break;case"acceptance_missing":wpcf7.setStatus(c,"unaccepted"),wpcf7.triggerEvent(e.into,"unaccepted",i);break;case"spam":wpcf7.setStatus(c,"spam"),wpcf7.triggerEvent(e.into,"spam",i);break;case"aborted":wpcf7.setStatus(c,"aborted"),wpcf7.triggerEvent(e.into,"aborted",i);break;case"mail_sent":wpcf7.setStatus(c,"sent"),wpcf7.triggerEvent(e.into,"mailsent",i);break;case"mail_failed":wpcf7.setStatus(c,"failed"),wpcf7.triggerEvent(e.into,"mailfailed",i);break;default:wpcf7.setStatus(c,"custom-"+e.status.replace(/[^0-9a-z]+/i,"-"))}wpcf7.refill(c,e),wpcf7.triggerEvent(e.into,"submit",i),"mail_sent"==e.status&&(c.each((function(){this.reset()})),wpcf7.toggleSubmit(c),wpcf7.resetCounter(c)),wpcf7.supportHtml5.placeholder||c.find("[placeholder].placeheld").each((function(e,a){t(a).val(t(a).attr("placeholder"))})),t(".wpcf7-response-output",c).html("").append(e.message).slideDown("fast"),t(".screen-reader-response",c.closest(".wpcf7")).each((function(){var a=t(this);if(a.html("").append(e.message),e.invalid_fields){var n=t("<ul></ul>");t.each(e.invalid_fields,(function(e,a){if(a.idref)var i=t("<li></li>").append(t("<a></a>").attr("href","#"+a.idref).append(a.message));else i=t("<li></li>").append(a.message);n.append(i)})),a.append(n)}a.focus()})),e.posted_data_hash&&c.find('input[name="_wpcf7_posted_data_hash"]').first().val(e.posted_data_hash)}(e,0,0,a),t(".ajax-loader",a).removeClass("is-active")})).fail((function(e,n,i){var c=t('<div class="ajax-error"></div>').text(i.message);a.after(c)}))}},wpcf7.triggerEvent=function(e,a,n){var i=new CustomEvent("wpcf7"+a,{bubbles:!0,detail:n});t(e).get(0).dispatchEvent(i)},wpcf7.setStatus=function(e,a){var n=t(e),i=n.data("status");n.data("status",a),n.addClass(a),i&&i!==a&&n.removeClass(i)},wpcf7.toggleSubmit=function(e,a){var n=t(e),i=t("input:submit",n);void 0===a?n.hasClass("wpcf7-acceptance-as-validation")||(i.prop("disabled",!1),t(".wpcf7-acceptance",n).each((function(){var e=t(this),a=t("input:checkbox",e);if(!e.hasClass("optional")&&(e.hasClass("invert")&&a.is(":checked")||!e.hasClass("invert")&&!a.is(":checked")))return i.prop("disabled",!0),!1}))):i.prop("disabled",!a)},wpcf7.resetCounter=function(e){var a=t(e);t(".wpcf7-character-count",a).each((function(){var e=t(this),n=e.attr("data-target-name"),i=e.hasClass("down"),c=parseInt(e.attr("data-starting-value"),10),s=parseInt(e.attr("data-maximum-value"),10),p=parseInt(e.attr("data-minimum-value"),10),o=function(a){var n=t(a).val().length,o=i?c-n:n;e.attr("data-current-value",o),e.text(o),s&&s<n?e.addClass("too-long"):e.removeClass("too-long"),p&&n<p?e.addClass("too-short"):e.removeClass("too-short")};t(':input[name="'+n+'"]',a).each((function(){o(this),t(this).keyup((function(){o(this)}))}))}))},wpcf7.notValidTip=function(e,a){var n=t(e);if(t(".wpcf7-not-valid-tip",n).remove(),t("<span></span>").attr({class:"wpcf7-not-valid-tip",role:"alert","aria-hidden":"true"}).text(a).appendTo(n),n.is(".use-floating-validation-tip *")){var i=function(e){t(e).not(":hidden").animate({opacity:0},"fast",(function(){t(this).css({"z-index":-100})}))};n.on("mouseover",".wpcf7-not-valid-tip",(function(){i(this)})),n.on("focus",":input",(function(){i(t(".wpcf7-not-valid-tip",n))}))}},wpcf7.refill=function(e,a){var n=t(e),i=function(e,a){t.each(a,(function(t,a){e.find(':input[name="'+t+'"]').val(""),e.find("img.wpcf7-captcha-"+t).attr("src",a);var n=/([0-9]+)\.(png|gif|jpeg)$/.exec(a);e.find('input:hidden[name="_wpcf7_captcha_challenge_'+t+'"]').attr("value",n[1])}))},c=function(e,a){t.each(a,(function(t,a){e.find(':input[name="'+t+'"]').val(""),e.find(':input[name="'+t+'"]').siblings("span.wpcf7-quiz-label").text(a[0]),e.find('input:hidden[name="_wpcf7_quiz_answer_'+t+'"]').attr("value",a[1])}))};void 0===a?t.ajax({type:"GET",url:wpcf7.apiSettings.getRoute("/contact-forms/"+wpcf7.getId(n)+"/refill"),beforeSend:function(t){var e=n.find(':input[name="_wpnonce"]').val();e&&t.setRequestHeader("X-WP-Nonce",e)},dataType:"json"}).done((function(t,e,a){t.captcha&&i(n,t.captcha),t.quiz&&c(n,t.quiz)})):(a.captcha&&i(n,a.captcha),a.quiz&&c(n,a.quiz))},wpcf7.clearResponse=function(e){var a=t(e);a.siblings(".screen-reader-response").html(""),t(".wpcf7-not-valid-tip",a).remove(),t("[aria-invalid]",a).attr("aria-invalid","false"),t(".wpcf7-form-control",a).removeClass("wpcf7-not-valid"),t(".wpcf7-response-output",a).hide().empty()},wpcf7.apiSettings.getRoute=function(t){var e=wpcf7.apiSettings.root;return e=e.replace(wpcf7.apiSettings.namespace,wpcf7.apiSettings.namespace+t)})}(jQuery),function(){if("function"==typeof window.CustomEvent)return!1;function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var a=document.createEvent("CustomEvent");return a.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),a}t.prototype=window.Event.prototype,window.CustomEvent=t}();