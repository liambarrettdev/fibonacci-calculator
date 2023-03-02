import React from 'react';
import { Link } from 'react-router-dom';

const SplashPage = () => {
  return (
    <div>
      <div>
        I'm the splash page!
      </div>
      <div>
        <Link to="/calc">Go to calculator</Link>
      </div>
    </div>
  );
};

export default SplashPage;