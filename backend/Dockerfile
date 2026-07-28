FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Riwayatek.Api/*.csproj Riwayatek.Api/
COPY Riwayatek.Application/*.csproj Riwayatek.Application/
COPY Riwayatek.Domain/*.csproj Riwayatek.Domain/
COPY Riwayatek.Infrastructure/*.csproj Riwayatek.Infrastructure/
RUN dotnet restore Riwayatek.Api/Riwayatek.Api.csproj

COPY . .
RUN dotnet publish Riwayatek.Api/Riwayatek.Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Riwayatek.Api.dll"]
