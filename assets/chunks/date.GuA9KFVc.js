const i={month:"short",day:"numeric",year:"numeric"},n=(t,r,o)=>{if(r===void 0)throw new TypeError("[maz-ui](FilterDate) The `locale` attribute is required.");if(typeof r!="string")throw new TypeError("[maz-ui](FilterDate) The `locale` attribute must be a string.");const a=o??i;try{const e=t instanceof Date?t:new Date(t);return new Intl.DateTimeFormat(r,a).format(e)}catch(e){throw new Error(`[maz-ui](FilterDate) ${e}`)}};export{n as d};
