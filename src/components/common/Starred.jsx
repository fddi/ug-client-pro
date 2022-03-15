import React, { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import Colors from '../../style/Colors';

export default function Starred(props) {

     const [starred, SetStarred] = useState(props.starred || false);

     onChange = (star) => {
          const { onChange } = this.props;
          SetStarred(star)
          onChange && onChange(star);
     }
     const { defaultColor, starredColor } = props;
     const com = starred ? (
          <HeartFilled style={{ color: starredColor || Colors.color_primary }}
               onClick={() => { onChange(false) }} />)
          : (<HeartOutlined style={{ color: defaultColor || Colors.color_gray }}
               onClick={() => { onChange(true) }} />)
     return (
          <Fragment>
               {com}
          </Fragment>
     )
}