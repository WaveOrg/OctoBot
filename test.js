function findMissing(target, source, rootElement = "") {
    let missing = [];

    for(const key of Object.keys(target)) {
        if(!source.hasOwnProperty(key)) {
            missing.push(`${rootElement}${rootElement !== "" ? "." : ""}${key}`);
            continue;
        }

        if(typeof target[key] === "object") {
            missing = missing.concat(findMissing(target[key], source[key], `${rootElement}${rootElement !== "" ? "." : ""}${key}`));
        }
    }

    return missing;
}

console.log(findMissing({ a: 1, b: { c: 2, d: 3 } }, { a: 2 }))