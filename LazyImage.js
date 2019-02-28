import React from 'react';
import LazyLoad from 'vanilla-lazyload/dist/lazyload.min.js'; //写成import LazyLoad from 'vanilla-lazyload'， npm run build会报错

// Only initialize it one time for the entire application
if (!document.lazyLoadInstance) {
  document.lazyLoadInstance = new LazyLoad({
    element_selector: '.lazy'
  });
}

export class LazyImage extends React.Component {
  // Update lazyLoad after first rendering of every image
  componentDidMount() {
    document.lazyLoadInstance.update();
  }

  // Update lazyLoad after rerendering of every image
  componentDidUpdate() {
    document.lazyLoadInstance.update();
  }

  // Just render the image with data-src
  render() {
    const { alt, src, srcset, sizes, width, height, onError, style } = this.props;
    return (
      <img
        alt={alt}
        className="lazy"
        data-src={src}
        data-srcset={srcset}
        data-sizes={sizes}
        width={width}
        height={height}
        style={style}
        onError={onError}
      />
    );
  }
}

export default LazyImage;
