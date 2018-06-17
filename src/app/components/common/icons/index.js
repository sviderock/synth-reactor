import React, { Component } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    '&:hover': {
      color: 'rgba(90, 125, 124, 1)',
    },
  },
});

export const MetronomeIcon = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 470 512">
      <path d="M442.032,192.56c-6.281-6.595-16.721-6.849-23.317-0.57l-8.089,7.703c-1.728-0.656-3.563-1.042-5.448-1.089
        c-4.381-0.109-8.609,1.528-11.776,4.544l-13.577,12.931c-4.748,4.521-6.19,11.192-4.296,17.036l-19.077,18.167L328.06,59.809
        c-0.755-5.087-3.838-9.531-8.342-12.018l-82.82-45.736c-4.961-2.74-10.984-2.74-15.945,0l-82.82,45.737
        c-4.503,2.487-7.586,6.931-8.342,12.018L65.598,492.733c-0.704,4.744,0.694,9.738,3.826,13.37
        c3.132,3.632,7.691,5.898,12.487,5.898h294.03c4.796,0,9.355-2.266,12.487-5.898c3.134-3.632,4.53-8.535,3.826-13.281
        L362.371,291.24l35.906-34.215c1.881,0.714,3.865,1.078,5.855,1.078c4.086,0,8.178-1.514,11.371-4.554l13.579-12.932
        c3.169-3.017,5.008-7.17,5.114-11.542c0.046-1.883-0.25-3.736-0.82-5.494l8.089-7.704
        C448.058,209.595,448.313,199.156,442.032,192.56z M333.152,319.021l7.258,48.948h-58.656L333.152,319.021z M228.926,35.332
        l46.871,25.884h-93.741L228.926,35.332z M158.037,94.2h141.777l27.489,184.91l-49.315,47.031V174.642
        c0-9.108-7.526-16.672-16.634-16.672h-64.858c-9.108,0-16.361,7.564-16.361,16.672v193.327h-62.693L158.037,94.2z
         M245.005,190.953v177.015H213.12V190.953H245.005z M101.029,479.016l11.523-78.063H345.3l11.522,78.063H101.029z"/>
    </SvgIcon>
  );
};

export const RecordIcon = props => {
  const state = props.active ? 'red' : '#fff';
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1">
        <g fill={state} transform="translate(-768.000000, -48.000000)">
          <path d="M781,54 L781,57 C781,59 779,61 777,61 L777,63 L780,63 L780,64 L773,64 L773,63 L776,63 L776,61 C774,61 772,59 772,57 L772,54 L773,54 L773,57 C773,58.5 774.5,60 776,60 L777,60 C778.5,60 780,58.5 780,57 L780,54 Z M776.004882,48 L776.995118,48 C778.1061,48 779,48.8918564 779,49.992017 L779,57.007983 C779,58.0998238 778.102384,59 776.995118,59 L776.004882,59 C774.8939,59 774,58.1081436 774,57.007983 L774,49.992017 C774,48.9001762 774.897616,48 776.004882,48 Z M775,49 L775,50 L776,50 L776,49 L775,49 Z M777,49 L777,50 L778,50 L778,49 L777,49 Z M774,50 L774,51 L775,51 L775,50 L774,50 Z M776,50 L776,51 L777,51 L777,50 L776,50 Z M778,50 L778,51 L779,51 L779,50 L778,50 Z M775,51 L775,52 L776,52 L776,51 L775,51 Z M777,51 L777,52 L778,52 L778,51 L777,51 Z M774,52 L774,53 L775,53 L775,52 L774,52 Z M776,52 L776,53 L777,53 L777,52 L776,52 Z M778,52 L778,53 L779,53 L779,52 L778,52 Z M775,53 L775,54 L776,54 L776,53 L775,53 Z M777,53 L777,54 L778,54 L778,53 L777,53 Z M777,53" id="Shape copy"/>
        </g>
      </g>
    </SvgIcon>
  );
};

RecordIcon.propTypes = {
  active: PropTypes.number
};