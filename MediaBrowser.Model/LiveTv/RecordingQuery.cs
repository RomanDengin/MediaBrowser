﻿namespace MediaBrowser.Model.LiveTv
{
    /// <summary>
    /// Class RecordingQuery.
    /// </summary>
    public class RecordingQuery
    {
        /// <summary>
        /// Gets or sets the channel identifier.
        /// </summary>
        /// <value>The channel identifier.</value>
        public string ChannelId { get; set; }

        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        /// <value>The user identifier.</value>
        public string UserId { get; set; }
    }

    public class TimerQuery
    {
        /// <summary>
        /// Gets or sets the channel identifier.
        /// </summary>
        /// <value>The channel identifier.</value>
        public string ChannelId { get; set; }
    }

    public class SeriesTimerQuery
    {
    }
}
