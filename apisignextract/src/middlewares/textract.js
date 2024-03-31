const { TextractClient } = require("@aws-sdk/client-textract");

const client = new TextractClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: "ASIAYS2NU5GKWX4YIUAM",
    secretAccessKey: "vnKST0RZr8D6KFFw5kX+ncrHwlcfBxb6nMG6aV7e",
    sessionToken: "IQoJb3JpZ2luX2VjEL3//////////wEaCmFwLXNvdXRoLTEiRzBFAiBVQJwk8e+0Ko5XoCV0365UnOH7QStU9ylRVDYM46NqagIhANGIgsC9zcUZAVGDhpQgzqSgbG3avOsbBSdSaE8QnX89KqsDCNb//////////wEQABoMNTkwMTgzOTgzNTA5IgzFY7XBarjqgiW3j1Qq/wJh8YQwUF3JtwGejOAVtTH4l/qzdoSXEhgTppJShKnZw9Z1El/QMstlD8CnMs7xnwcrPvd2jH4l9bimHYdl3nfMhgRoVl0Ti7O+MTjxPBSyM4PyFDzY4qsjV47D73Sttrs9gEUptCZEEZJEUQIUg1075DnHmnoxoTnwRycqfQexBVMoQxsCcMk8MaFtTocoFOex5BOZFkyQ0CzWv/l6yBSUwrZhDWXLL9ZODYAGaVvYzN4iM1ZXb47F1QluD0g59mAxxyznZDDwaCvDdcpJcS2hh3yfyhH6yptrHd2uLnXOMG9UC/8GAxz3z/lfwDg/CUIh7SDiWtKnSEIa3z+K6DIyjs5cf/mXF+dXoSxGu6lj/w0XimVgXWxFFUwD2whWKoB3oOKDkYCv3W4k20yRZ8ICSlglzWqzbp/U14V+KIlW/F8py45Kc77fB9+DxB6FyZGrqqHhnT0xKEl9ueGlXtfCckb/O9etfcUQpfaQbTtNbtvFx96WewX0oaWC1+HbITDVy5WwBjqmAWQ5y0Op35Idlz7G/oLintgbQxy65WZIfO1hbwm8i72rc7V4um/9HxCCUat7byajxTRMmR9vkzabEDbQwC35Yxie5fRSUB3XeZFfxXP3PdCktgFgNC+/avR1odYhiXM/KMbdFOLc62j0tgm2tDKH5PYciyXNWH/tduz4chF/gPlXZ8yRBeGpJwexz3ImbeFWAXx/9wSeJg0u3NcyeILeERHHckF4KAk=",
  },
});

module.exports = {
  client,
};
