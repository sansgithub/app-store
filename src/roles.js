const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function(){
    ac.grant("basic")
        .createOwn("app")
        .readOwn("app")
        .deleteOwn("app")
        .updateOwn("app")
    .grant("admin")
        .extend("basic")
        .readAny("app")
        .deleteAny("app")
        .updateOwn("user")
        .deleteAny("user")
        .readAny("user")
        .createOwn("user");

    return ac;
})();