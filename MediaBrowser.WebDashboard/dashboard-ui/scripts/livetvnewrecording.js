﻿(function ($, document, apiClient) {

    var currentProgram;

    function renderRecording(page, defaultTimer, program) {

        currentProgram = program;

        var context = 'livetv';

        $('.itemName', page).html(program.Name);
        $('.itemChannelNumber', page).html('Channel:&nbsp;&nbsp;&nbsp;<a href="livetvchannel.html?id=' + program.ChannelId + '">' + program.ChannelName + '</a>').trigger('create');

        if (program.EpisodeTitle) {
            $('.itemEpisodeName', page).html('Episode:&nbsp;&nbsp;&nbsp;' + program.EpisodeTitle);
        } else {
            $('.itemEpisodeName', page).html('');
        }

        if (program.CommunityRating) {
            $('.itemCommunityRating', page).html(LibraryBrowser.getRatingHtml(program)).show();
        } else {
            $('.itemCommunityRating', page).hide();
        }

        LibraryBrowser.renderGenres($('.itemGenres', page), program, context);
        LibraryBrowser.renderOverview($('.itemOverview', page), program);

        $('.itemMiscInfo', page).html(LibraryBrowser.getMiscInfoHtml(program));

        $('#chkNewOnly', page).checked(defaultTimer.RecordNewOnly).checkboxradio('refresh');
        $('#chkAllChannels', page).checked(defaultTimer.RecordAnyChannel).checkboxradio('refresh');
        $('#chkAnyTime', page).checked(defaultTimer.RecordAnyTime).checkboxradio('refresh');

        $('#txtPrePaddingSeconds', page).val(defaultTimer.PrePaddingSeconds);
        $('#txtPostPaddingSeconds', page).val(defaultTimer.PostPaddingSeconds);
        $('#chkPrePaddingRequired', page).checked(defaultTimer.IsPrePaddingRequired).checkboxradio('refresh');
        $('#chkPostPaddingRequired', page).checked(defaultTimer.IsPostPaddingRequired).checkboxradio('refresh');

        if (program.IsSeries) {
            $('#eligibleForSeriesFields', page).show();
        } else {
            $('#eligibleForSeriesFields', page).hide();
        }

        selectDays(page, defaultTimer.Days);

        Dashboard.hideLoadingMsg();
    }

    function reload(page) {

        Dashboard.showLoadingMsg();

        var programId = getParameterByName('programid');

        var promise1 = apiClient.getNewLiveTvTimerDefaults({ programId: programId });
        var promise2 = apiClient.getLiveTvProgram(programId, Dashboard.getCurrentUserId());

        $.when(promise1, promise2).done(function (response1, response2) {

            var defaults = response1[0];
            var program = response2[0];

            renderRecording(page, defaults, program);
        });
    }

    function selectDays(page, days) {

        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (var i = 0, length = daysOfWeek.length; i < length; i++) {

            var day = daysOfWeek[i];

            $('#chk' + day, page).checked(days.indexOf(day) != -1).checkboxradio('refresh');

        }

    }

    function getDays(page) {

        var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var days = [];

        for (var i = 0, length = daysOfWeek.length; i < length; i++) {

            var day = daysOfWeek[i];

            if ($('#chk' + day, page).checked()) {
                days.push(day);
            }

        }

        return days;
    }

    function onSubmit() {

        Dashboard.showLoadingMsg();

        var form = this;

        apiClient.getNewLiveTvTimerDefaults({ programId: currentProgram.Id }).done(function (item) {

            item.PrePaddingSeconds = $('#txtPrePaddingSeconds', form).val();
            item.PostPaddingSeconds = $('#txtPostPaddingSeconds', form).val();
            item.IsPrePaddingRequired = $('#chkPrePaddingRequired', form).checked();
            item.IsPostPaddingRequired = $('#chkPostPaddingRequired', form).checked();

            item.RecordNewOnly = $('#chkNewOnly', form).checked();
            item.RecordAnyChannel = $('#chkAllChannels', form).checked();
            item.RecordAnyTime = $('#chkAnyTime', form).checked();

            item.Days = getDays(form);

            if ($('#chkRecordSeries', form).checked()) {

                apiClient.createLiveTvSeriesTimer(item).done(function () {

                    Dashboard.hideLoadingMsg();
                    Dashboard.navigate('livetvseriestimers.html');

                });

            } else {
                apiClient.createLiveTvTimer(item).done(function () {

                    Dashboard.hideLoadingMsg();
                    Dashboard.navigate('livetvtimers.html');

                });
            }

        });

        // Disable default form submission
        return false;
    }

    function liveTvNewRecordingPage() {

        var self = this;

        self.onSubmit = onSubmit;

    }

    window.LiveTvNewRecordingPage = new liveTvNewRecordingPage();

    $(document).on('pageinit', "#liveTvNewRecordingPage", function () {

        var page = this;

        $('#chkRecordSeries', page).on('change', function () {

            if (this.checked) {
                $('#seriesFields', page).show();
            } else {
                $('#seriesFields', page).hide();
            }

        });
        
        $('#btnCancel', page).on('click', function () {

            Dashboard.navigate('livetvchannel.html?id=' + currentProgram.ChannelId);

        });

    }).on('pagebeforeshow', "#liveTvNewRecordingPage", function () {

        var page = this;

        reload(page);

    }).on('pagehide', "#liveTvNewRecordingPage", function () {

        currentProgram = null;

    });

})(jQuery, document, ApiClient);