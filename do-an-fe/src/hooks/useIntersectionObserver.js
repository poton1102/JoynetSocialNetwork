import React, { useState, useEffect, useRef } from 'react';

const useIntersection = (callback, options) => {
    const [node, setNode] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback();
                    // console.log(entry)
                }
            });
        }, options);

        if (node) observer.current.observe(node);

        return () => {
            observer.current.disconnect();
        };
    }, [node, options, callback]);

    return setNode;
};

export default useIntersection;
